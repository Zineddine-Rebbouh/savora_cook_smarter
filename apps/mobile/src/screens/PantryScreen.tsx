import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePantry, type PantryItem } from '../state/PantryContext';
import type { AppTheme } from '../theme';

type PantryScreenProps = {
  theme: AppTheme;
};

const categories = ['All', 'Produce', 'Dairy', 'Meat', 'Pantry', 'Freezer'];

export function PantryScreen({ theme }: PantryScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newCategory, setNewCategory] = useState('Produce');
  const { items, addIngredient, removeItem } = usePantry();
  const styles = createStyles(theme);

  const visibleItems =
    selectedCategory === 'All'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  async function submitItem() {
    const name = newName.trim();

    if (!name) {
      return;
    }

    await addIngredient(name, newQuantity.trim() || '1x', newCategory);
    setNewName('');
    setNewQuantity('');
    setNewCategory('Produce');
    setModalOpen(false);
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pagePadding}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>My Pantry</Text>
              <Text style={styles.subtitle}>{items.length} items tracked</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => setEditing((value) => !value)}
                style={({ pressed }) => [
                  styles.actionPill,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.actionPillText}>
                  {editing ? 'Done' : 'Edit'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setModalOpen(true)}
                style={({ pressed }) => [
                  styles.primaryPill,
                  pressed && styles.pressed,
                ]}
              >
                <Feather color={theme.colors.textInverse} name="plus" size={16} />
                <Text style={styles.primaryPillText}>Add Item</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.alertBanner}>
            <View style={styles.alertDot} />
            <Text style={styles.alertText}>
              Your heavy cream expires tomorrow — 3 recipes use it →
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={
                    selectedCategory === category
                      ? styles.categoryChipTextActive
                      : styles.categoryChipText
                  }
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            style={({ pressed }) => [styles.matchCard, pressed && styles.pressed]}
          >
            <View>
              <Text style={styles.matchLabel}>Zero-waste match</Text>
              <Text style={styles.matchTitle}>
                Based on your pantry, you can cook 6 recipes right now
              </Text>
            </View>
            <Feather color={theme.colors.accentSecondary} name="chevron-right" size={20} />
          </Pressable>

          <Text style={styles.gridHeading}>Ingredients</Text>
          {editing ? (
            <Text style={styles.editHint}>Tap an item to remove it from your pantry</Text>
          ) : null}
          <FlatList
            data={visibleItems}
            numColumns={3}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            columnWrapperStyle={styles.gridRow}
            renderItem={({ item }) => (
              <IngredientCard
                editing={editing}
                item={item}
                onRemove={() => removeItem(item.id)}
                theme={theme}
              />
            )}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
        transparent
        visible={modalOpen}
      >
        <Pressable onPress={() => setModalOpen(false)} style={styles.backdrop} />
        <View style={styles.addSheet}>
          <View style={styles.handle} />
          <Text style={styles.addTitle}>Add to Pantry</Text>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setNewName}
            placeholder="Item name"
            placeholderTextColor={theme.colors.textTertiary}
            style={styles.input}
            value={newName}
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setNewQuantity}
            placeholder="Quantity (e.g. 2 pcs, 400g)"
            placeholderTextColor={theme.colors.textTertiary}
            style={styles.input}
            value={newQuantity}
          />

          <Text style={styles.addCategoryLabel}>Category</Text>
          <ScrollView
            contentContainerStyle={styles.categoryRow}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.filter((category) => category !== 'All').map((category) => (
              <Pressable
                key={category}
                onPress={() => setNewCategory(category)}
                style={[
                  styles.categoryChip,
                  newCategory === category && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={
                    newCategory === category
                      ? styles.categoryChipTextActive
                      : styles.categoryChipText
                  }
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            disabled={!newName.trim()}
            onPress={submitItem}
            style={({ pressed }) => [
              styles.addButton,
              !newName.trim() && styles.addButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.addButtonText}>Add Item</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function IngredientCard({
  editing,
  item,
  onRemove,
  theme,
}: {
  editing: boolean;
  item: PantryItem;
  onRemove: () => void;
  theme: AppTheme;
}) {
  const styles = createStyles(theme);

  return (
    <Pressable disabled={!editing} onPress={onRemove} style={styles.ingredientCard}>
      {editing ? (
        <View style={styles.removeBadge}>
          <Feather color={theme.colors.textInverse} name="x" size={10} />
        </View>
      ) : null}
      <View style={styles.ingredientIcon} />
      <Text style={styles.ingredientName}>{item.name}</Text>
      <Text style={styles.ingredientQuantity}>{item.quantity}</Text>
      <View style={styles.ingredientFooter}>
        <View
          style={[
            styles.expiryDot,
            item.alert === 'high'
              ? styles.expiryHigh
              : item.alert === 'medium'
              ? styles.expiryMedium
              : styles.expiryLow,
          ]}
        />
        <Text style={styles.expiryText}>{item.expiry}</Text>
      </View>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  const { colors, fonts, radius, spacing } = theme;

  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.bgPrimary,
      flex: 1,
    },
    content: {
      paddingBottom: spacing[12],
      backgroundColor: colors.bgPrimary,
    },
    pagePadding: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[6],
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[5],
    },
    title: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 28,
      lineHeight: 36,
    },
    subtitle: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
      marginTop: spacing[1],
    },
    headerActions: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[2],
    },
    actionPill: {
      alignItems: 'center',
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.pill,
      borderColor: colors.borderSubtle,
      borderWidth: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
      height: 44,
    },
    actionPillText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    primaryPill: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      flexDirection: 'row',
      gap: spacing[2],
      height: 44,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
    },
    primaryPillText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
    },
    alertBanner: {
      alignItems: 'center',
      backgroundColor: colors.warningSurface,
      borderRadius: radius.lg,
      flexDirection: 'row',
      gap: spacing[3],
      marginBottom: spacing[5],
      padding: spacing[4],
    },
    alertDot: {
      backgroundColor: colors.accentWarning,
      borderRadius: radius.pill,
      height: 12,
      width: 12,
    },
    alertText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      lineHeight: 20,
      flex: 1,
    },
    categoryRow: {
      gap: spacing[3],
      marginBottom: spacing[5],
    },
    categoryChip: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.pill,
      borderColor: colors.borderSubtle,
      borderWidth: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    categoryChipActive: {
      backgroundColor: colors.accentPrimary,
      borderColor: colors.accentPrimary,
    },
    categoryChipText: {
      color: colors.textPrimary,
      fontFamily: fonts.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
    },
    categoryChipTextActive: {
      color: colors.textInverse,
    },
    matchCard: {
      alignItems: 'center',
      backgroundColor: colors.aiBg,
      borderColor: colors.aiBorder,
      borderRadius: radius.xl,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing[5],
      padding: spacing[5],
    },
    pressed: {
      opacity: 0.7,
    },
    matchLabel: {
      color: colors.aiText,
      fontFamily: fonts.bodyMedium,
      fontSize: 12,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: spacing[2],
    },
    matchTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 18,
      lineHeight: 26,
      maxWidth: 260,
    },
    gridHeading: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 20,
      lineHeight: 28,
      marginBottom: spacing[4],
    },
    gridRow: {
      justifyContent: 'space-between',
      columnGap: spacing[4],
      marginBottom: spacing[4],
    },
    ingredientCard: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radius.xl,
      flex: 1,
      minWidth: 100,
      padding: spacing[4],
      ...theme.shadows.card,
    },
    ingredientIcon: {
      backgroundColor: colors.bgTertiary,
      borderRadius: radius.lg,
      height: 56,
      marginBottom: spacing[4],
      width: '100%',
    },
    ingredientName: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: spacing[1],
    },
    ingredientQuantity: {
      color: colors.textSecondary,
      fontFamily: fonts.monoMedium,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: spacing[3],
    },
    ingredientFooter: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing[2],
    },
    expiryDot: {
      borderRadius: radius.pill,
      height: 10,
      width: 10,
    },
    expiryHigh: {
      backgroundColor: colors.accentDanger,
    },
    expiryMedium: {
      backgroundColor: colors.accentWarning,
    },
    expiryLow: {
      backgroundColor: colors.accentSecondary,
    },
    expiryText: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 11,
      lineHeight: 16,
    },
    editHint: {
      color: colors.textSecondary,
      fontFamily: fonts.body,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: spacing[4],
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.overlayStrong,
    },
    addSheet: {
      backgroundColor: colors.surfaceElevated,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      bottom: 0,
      left: 0,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
      paddingBottom: spacing[8],
      position: 'absolute',
      right: 0,
      ...theme.shadows.elevated,
    },
    handle: {
      alignSelf: 'center',
      backgroundColor: colors.borderStrong,
      borderRadius: radius.pill,
      height: 4,
      marginBottom: spacing[4],
      width: 44,
    },
    addTitle: {
      color: colors.textPrimary,
      fontFamily: fonts.displaySemiBold,
      fontSize: 24,
      lineHeight: 32,
      marginBottom: spacing[4],
    },
    input: {
      backgroundColor: colors.surfaceCard,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
      borderWidth: 1,
      color: colors.textPrimary,
      fontFamily: fonts.body,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: spacing[3],
      minHeight: 52,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    addCategoryLabel: {
      color: colors.textPrimary,
      fontFamily: fonts.bodySemiBold,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: spacing[3],
    },
    addButton: {
      alignItems: 'center',
      backgroundColor: colors.accentPrimary,
      borderRadius: radius.pill,
      justifyContent: 'center',
      marginTop: spacing[4],
      minHeight: 54,
      paddingHorizontal: spacing[4],
      ...theme.shadows.elevated,
    },
    addButtonDisabled: {
      opacity: 0.52,
    },
    addButtonText: {
      color: colors.textInverse,
      fontFamily: fonts.bodySemiBold,
      fontSize: 15,
      lineHeight: 22,
    },
    removeBadge: {
      alignItems: 'center',
      backgroundColor: colors.accentDanger,
      borderRadius: radius.pill,
      height: 22,
      justifyContent: 'center',
      position: 'absolute',
      right: spacing[2],
      top: spacing[2],
      width: 22,
      zIndex: 1,
    },
  });
}
