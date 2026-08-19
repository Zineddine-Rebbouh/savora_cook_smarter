"""initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-19 17:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('email', sa.String(length=320), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('display_name', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    op.create_table(
        'profiles',
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('dietary_preferences', sa.JSON(), nullable=False),
        sa.Column('cooking_since', sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('user_id')
    )

    op.create_table(
        'pantry_items',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('quantity', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('expiry_date', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_pantry_items_owner_id'), 'pantry_items', ['owner_id'], unique=False)

    op.create_table(
        'recipes',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('source_url', sa.String(length=2048), nullable=True),
        sa.Column('hero_image', sa.String(length=2048), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('hero_tag', sa.String(length=100), nullable=True),
        sa.Column('servings', sa.Integer(), nullable=False),
        sa.Column('prep_minutes', sa.Integer(), nullable=False),
        sa.Column('cook_minutes', sa.Integer(), nullable=False),
        sa.Column('difficulty', sa.String(length=20), nullable=False),
        sa.Column('nutrition', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_recipes_owner_id'), 'recipes', ['owner_id'], unique=False)

    op.create_table(
        'cook_logs',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('recipe_id', sa.UUID(), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.CheckConstraint('rating BETWEEN 1 AND 5', name='cook_log_rating_range'),
        sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_cook_logs_recipe_id'), 'cook_logs', ['recipe_id'], unique=False)
    op.create_index(op.f('ix_cook_logs_user_id'), 'cook_logs', ['user_id'], unique=False)

    op.create_table(
        'ingredients',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('recipe_id', sa.UUID(), nullable=False),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('unit', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('note', sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ingredients_recipe_id'), 'ingredients', ['recipe_id'], unique=False)

    op.create_table(
        'recipe_steps',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('recipe_id', sa.UUID(), nullable=False),
        sa.Column('sort_order', sa.Integer(), nullable=False),
        sa.Column('instruction', sa.Text(), nullable=False),
        sa.Column('timer_minutes', sa.Integer(), nullable=True),
        sa.Column('linked_recipe', sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_recipe_steps_recipe_id'), 'recipe_steps', ['recipe_id'], unique=False)

    op.create_table(
        'meal_plans',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('week_start', sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('owner_id', 'week_start', name='unique_owner_week')
    )
    op.create_index(op.f('ix_meal_plans_owner_id'), 'meal_plans', ['owner_id'], unique=False)

    op.create_table(
        'meal_plan_entries',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('meal_plan_id', sa.UUID(), nullable=False),
        sa.Column('recipe_id', sa.UUID(), nullable=False),
        sa.Column('day', sa.Integer(), nullable=False),
        sa.Column('slot', sa.String(length=20), nullable=False),
        sa.CheckConstraint('day BETWEEN 0 AND 6', name='meal_plan_day_range'),
        sa.ForeignKeyConstraint(['meal_plan_id'], ['meal_plans.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_meal_plan_entries_meal_plan_id'), 'meal_plan_entries', ['meal_plan_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_meal_plan_entries_meal_plan_id'), table_name='meal_plan_entries')
    op.drop_table('meal_plan_entries')
    op.drop_index(op.f('ix_meal_plans_owner_id'), table_name='meal_plans')
    op.drop_table('meal_plans')
    op.drop_index(op.f('ix_recipe_steps_recipe_id'), table_name='recipe_steps')
    op.drop_table('recipe_steps')
    op.drop_index(op.f('ix_ingredients_recipe_id'), table_name='ingredients')
    op.drop_table('ingredients')
    op.drop_index(op.f('ix_cook_logs_user_id'), table_name='cook_logs')
    op.drop_index(op.f('ix_cook_logs_recipe_id'), table_name='cook_logs')
    op.drop_table('cook_logs')
    op.drop_index(op.f('ix_recipes_owner_id'), table_name='recipes')
    op.drop_table('recipes')
    op.drop_index(op.f('ix_pantry_items_owner_id'), table_name='pantry_items')
    op.drop_table('pantry_items')
    op.drop_table('profiles')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
