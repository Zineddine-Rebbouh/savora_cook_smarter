import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { apiClient, setUnauthenticatedHandler } from '../client';
import * as authApi from '../auth';
import * as recipesApi from '../recipes';
import * as pantryApi from '../pantry';
import * as mealPlansApi from '../mealPlans';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '../storage';

describe('API Client & Token Storage', () => {
  let mock: AxiosMockAdapter;

  beforeEach(async () => {
    mock = new AxiosMockAdapter(apiClient as any);
    await clearTokens();
    setUnauthenticatedHandler(null);
  });

  afterEach(() => {
    mock.restore();
  });

  test('token storage saves and clears tokens', async () => {
    await setTokens('test-access', 'test-refresh');
    expect(await getAccessToken()).toBe('test-access');
    expect(await getRefreshToken()).toBe('test-refresh');

    await clearTokens();
    expect(await getAccessToken()).toBeNull();
    expect(await getRefreshToken()).toBeNull();
  });

  test('request interceptor attaches Bearer token when present', async () => {
    await setTokens('valid-access-token', 'valid-refresh-token');

    mock.onGet('/me/').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer valid-access-token');
      return [
        200,
        {
          display_name: 'Test User',
          dietary_preferences: ['Vegan'],
          cooking_since: '2024-01-01',
          cooked_count: 5,
        },
      ];
    });

    const res = await authApi.getMe();
    expect(res.display_name).toBe('Test User');
    expect(res.dietary_preferences).toEqual(['Vegan']);
  });

  test('response interceptor performs 401 token refresh successfully', async () => {
    await setTokens('expired-access-token', 'valid-refresh-token');

    const globalMock = new AxiosMockAdapter(axios as any);

    globalMock
      .onPost('http://localhost:8000/api/v1/auth/refresh/')
      .reply(200, {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      });

    let callCount = 0;
    mock.onGet('/recipes/').reply((config) => {
      callCount++;
      if (callCount === 1) {
        expect(config.headers?.Authorization).toBe('Bearer expired-access-token');
        return [401, { detail: 'Token expired' }];
      }
      expect(config.headers?.Authorization).toBe('Bearer new-access-token');
      return [
        200,
        {
          items: [{ id: 'r1', title: 'Pasta' }],
          total: 1,
          limit: 20,
          offset: 0,
        },
      ];
    });

    const res = await recipesApi.getRecipes();
    expect(res.items.length).toBe(1);
    expect(res.items[0].title).toBe('Pasta');
    expect(await getAccessToken()).toBe('new-access-token');
    expect(await getRefreshToken()).toBe('new-refresh-token');

    globalMock.restore();
  });

  test('response interceptor triggers unauthenticated handler when refresh fails', async () => {
    await setTokens('expired-access-token', 'invalid-refresh-token');

    const globalMock = new AxiosMockAdapter(axios as any);
    globalMock
      .onPost('http://localhost:8000/api/v1/auth/refresh/')
      .reply(401, { detail: 'Invalid refresh token' });

    const unauthHandler = jest.fn();
    setUnauthenticatedHandler(unauthHandler);

    mock.onGet('/me/').reply(401, { detail: 'Unauthorized' });

    await expect(authApi.getMe()).rejects.toThrow();
    expect(unauthHandler).toHaveBeenCalledTimes(1);
    expect(await getAccessToken()).toBeNull();
    expect(await getRefreshToken()).toBeNull();

    globalMock.restore();
  });
});

describe('Domain API Wrappers', () => {
  let mock: AxiosMockAdapter;

  beforeEach(() => {
    mock = new AxiosMockAdapter(apiClient as any);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('auth API', () => {
    test('register calls POST /auth/register/', async () => {
      mock.onPost('/auth/register/').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.email).toBe('user@example.com');
        return [201, { access_token: 'acc', refresh_token: 'ref' }];
      });

      const res = await authApi.register({
        email: 'user@example.com',
        password: 'password123',
        display_name: 'Test User',
      });
      expect(res.access_token).toBe('acc');
    });

    test('login calls POST /auth/login/', async () => {
      mock.onPost('/auth/login/').reply(200, { access_token: 'acc', refresh_token: 'ref' });
      const res = await authApi.login({ email: 'user@example.com', password: 'password123' });
      expect(res.access_token).toBe('acc');
    });
  });

  describe('recipes API', () => {
    test('getRecipes passes search query params', async () => {
      mock.onGet('/recipes/').reply((config) => {
        expect(config.params).toEqual({ search: 'chicken', limit: 10, offset: 0 });
        return [200, { items: [], total: 0, limit: 10, offset: 0 }];
      });

      const res = await recipesApi.getRecipes({ search: 'chicken', limit: 10, offset: 0 });
      expect(res.total).toBe(0);
    });

    test('createRecipe sends recipe payload', async () => {
      mock.onPost('/recipes/').reply((config) => {
        const body = JSON.parse(config.data);
        expect(body.title).toBe('Tacos');
        return [201, { id: 'r2', title: 'Tacos', servings: 2, prep_minutes: 10, cook_minutes: 15, difficulty: 'Easy', nutrition: [], ingredients: [], steps: [], created_at: '', updated_at: '', source_url: null, hero_image: null, description: null, hero_tag: null }];
      });

      const res = await recipesApi.createRecipe({ title: 'Tacos' });
      expect(res.id).toBe('r2');
    });

    test('logCook posts cook log', async () => {
      mock.onPost('/recipes/r2/cook-logs/').reply(201, {
        id: 'cl1',
        recipe_id: 'r2',
        recipe_title: 'Tacos',
        recipe_hero_image: null,
        date: '2026-08-19',
        rating: 5,
        note: 'Delicious',
      });

      const res = await recipesApi.logCook('r2', { rating: 5, note: 'Delicious' });
      expect(res.id).toBe('cl1');
      expect(res.rating).toBe(5);
    });
  });

  describe('pantry API', () => {
    test('getPantryItems calls GET /pantry-items/', async () => {
      mock.onGet('/pantry-items/').reply(200, { items: [{ id: 'p1', name: 'Milk', quantity: '1 gal', category: 'Dairy', expiry_date: null }], total: 1, limit: 20, offset: 0 });
      const res = await pantryApi.getPantryItems();
      expect(res.items[0].name).toBe('Milk');
    });

    test('createPantryItem calls POST /pantry-items/', async () => {
      mock.onPost('/pantry-items/').reply(201, { id: 'p2', name: 'Eggs', quantity: '12', category: 'Dairy', expiry_date: null });
      const res = await pantryApi.createPantryItem({ name: 'Eggs', quantity: '12', category: 'Dairy' });
      expect(res.id).toBe('p2');
    });

    test('deletePantryItem calls DELETE /pantry-items/{id}', async () => {
      mock.onDelete('/pantry-items/p2').reply(204);
      await expect(pantryApi.deletePantryItem('p2')).resolves.toBeUndefined();
    });
  });

  describe('mealPlans API', () => {
    test('getMealPlans calls GET /meal-plans/', async () => {
      mock.onGet('/meal-plans/').reply(200, [{ id: 'mp1', week_start: '2026-08-17', entries: [] }]);
      const res = await mealPlansApi.getMealPlans();
      expect(res[0].id).toBe('mp1');
    });

    test('addMealPlanEntry calls POST /meal-plans/{id}/entries/', async () => {
      mock.onPost('/meal-plans/mp1/entries/').reply(201, {
        id: 'mpe1',
        recipe_id: 'r1',
        recipe_title: 'Pasta',
        recipe_hero_image: null,
        day: 0,
        slot: 'dinner',
      });

      const res = await mealPlansApi.addMealPlanEntry('mp1', { recipe_id: 'r1', day: 0, slot: 'dinner' });
      expect(res.id).toBe('mpe1');
      expect(res.slot).toBe('dinner');
    });

    test('removeMealPlanEntry calls DELETE /meal-plans/{id}/entries/{entryId}', async () => {
      mock.onDelete('/meal-plans/mp1/entries/mpe1').reply(204);
      await expect(mealPlansApi.removeMealPlanEntry('mp1', 'mpe1')).resolves.toBeUndefined();
    });
  });
});
