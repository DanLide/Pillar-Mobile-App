import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fonts, SVGs } from '../theme';
import { not } from 'ramda';
import { TOAST_OFFSET_ABOVE_SINGLE_BUTTON } from '../contexts';

export enum DropdownDirection {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface DropdownItem {
  label: string;
  value: number | string;
}

interface Props {
  data: Array<DropdownItem>;
  label: string;
  item?: DropdownItem;
  bottomOffset?: number;
  dropdownDirection?: DropdownDirection;
  maxHeight?: number;
  onSelect?: (item: { label: string; value: string }) => void;
}

const Z_INDEX_DEFAULT = 1;
const Z_INDEX_LABEL = 9999;

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export const Dropdown = memo(
  ({
    data,
    item,
    label,
    dropdownDirection = DropdownDirection.TOP,
    bottomOffset = TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
    maxHeight = 200,
  }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pickerHeight, setPickerHeight] = useState(0);
    const [direction, setDirection] = useState(dropdownDirection);

    const pickerRef = useRef<TouchableOpacity>(null);

    const dropdownContainerStyle = useMemo(
      () => [
        styles.dropdownContainer,
        {
          [direction]: 0,
          maxHeight,
        },
      ],
      [direction, maxHeight],
    );

    const handleLayoutChange = useCallback((e: LayoutChangeEvent) => {
      setPickerHeight(e.nativeEvent.layout.height);
    }, []);

    const handlePress = useCallback(async () => {
      if (!isOpen) {
        const yOffset = await new Promise<number>(resolve =>
          pickerRef.current?.measureInWindow((_, y) => resolve(y)),
        );

        const size = yOffset + maxHeight + pickerHeight + bottomOffset;

        const direction =
          size < WINDOW_HEIGHT
            ? DropdownDirection.TOP
            : DropdownDirection.BOTTOM;

        setDirection(direction);
      }

      setIsOpen(not);
    }, [isOpen, maxHeight, pickerHeight, bottomOffset]);

    const renderItem = useCallback<ListRenderItem<DropdownItem>>(
      ({ item }) => (
        <Pressable
          key={item.value}
          style={{
            borderColor: colors.grayLight2,
            borderBottomWidth: 0.5,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
          onPress={handlePress}
        >
          <Text numberOfLines={1} style={[styles.category]}>
            {item.label}
          </Text>
        </Pressable>
      ),
      [handlePress],
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={handlePress}
          onLayout={handleLayoutChange}
          ref={pickerRef}
        >
          {!isOpen && (
            <View style={styles.pickerLabelContainer}>
              <Text style={styles.pickerLabel}>{label}</Text>
            </View>
          )}
          <Text numberOfLines={1} style={styles.category}>
            {item?.label}
          </Text>
          <SVGs.DownIcon color={colors.black} />
        </TouchableOpacity>

        {isOpen && (
          <View style={dropdownContainerStyle}>
            <View style={styles.pickerLabelContainer}>
              <Text
                style={[
                  styles.pickerLabel,
                  { color: colors.purpleDark, fontFamily: fonts.TT_Bold },
                ]}
              >
                {label}
              </Text>
            </View>
            <FlatList
              contentContainerStyle={styles.flatListContentContainer}
              data={data}
              renderItem={renderItem}
              style={styles.flex}
              nestedScrollEnabled
            />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  category: {
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  container: {
    width: '100%',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  flatListContentContainer: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  pickerContainer: {
    alignItems: 'center',
    borderColor: colors.neutral30,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerLabel: {
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
    fontSize: 12,
    lineHeight: 16,
  },
  pickerLabelContainer: {
    backgroundColor: colors.white,
    borderRadius: 2,
    left: 6,
    paddingHorizontal: 1,
    position: 'absolute',
    top: -8,
    zIndex: Z_INDEX_LABEL,
  },
});
