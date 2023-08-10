import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  Modal,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { not } from 'ramda';

import { colors, fonts, SVGs } from '../theme';
import { TOAST_OFFSET_ABOVE_SINGLE_BUTTON } from '../contexts';

export enum DropdownDirection {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface DropdownItem {
  label: string;
  value: number | string;
}

interface Props<T> extends ViewProps {
  data: Array<T>;
  label: string;
  selectedItem?: T;
  bottomOffset?: number;
  dropdownDirection?: DropdownDirection;
  maxHeight?: number;
  onSelect?: (item: T) => void;
  renderItem?: (item: T) => JSX.Element;
}

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

const OptionsSeparator = () => <View style={styles.optionsSeparator} />;

const isDropdownItem = <T,>(item?: DropdownItem | T): item is DropdownItem =>
  !!(item as DropdownItem)?.value;

export const Dropdown = <T extends object | number | string = DropdownItem>({
  data,
  selectedItem,
  label,
  dropdownDirection = DropdownDirection.TOP,
  bottomOffset = TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  maxHeight = 200,
  renderItem,
  style,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerHeight, setPickerHeight] = useState(0);
  const [pickerOffset, setPickerOffset] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(dropdownDirection);

  const pickerRef = useRef<TouchableOpacity>(null);

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, style],
    [style],
  );

  const dropdownContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.dropdownContainer,
      {
        [direction]: pickerOffset.y,
        left: pickerOffset.x - 16,
        maxHeight,
      },
    ],
    [direction, maxHeight, pickerOffset],
  );

  const SelectedOption = useMemo<JSX.Element | null>(() => {
    if (selectedItem && renderItem) return renderItem(selectedItem);

    if (isDropdownItem(selectedItem)) {
      return (
        <Text numberOfLines={1} style={styles.optionLabel}>
          {selectedItem?.label}
        </Text>
      );
    }

    return null;
  }, [selectedItem, renderItem]);

  const handleLayoutChange = useCallback((e: LayoutChangeEvent) => {
    setPickerHeight(e.nativeEvent.layout.height);
  }, []);

  const handlePress = useCallback(async () => {
    if (!isOpen) {
      const [x, y] = await new Promise<[number, number]>(resolve =>
        pickerRef.current?.measureInWindow((x, y) => resolve([x, y])),
      );

      const size = y + maxHeight + pickerHeight + bottomOffset;

      const direction =
        size < WINDOW_HEIGHT ? DropdownDirection.TOP : DropdownDirection.BOTTOM;

      setDirection(direction);
      setPickerOffset({ x, y });
    }

    setIsOpen(not);
  }, [isOpen, maxHeight, pickerHeight, bottomOffset]);

  const renderOption = useCallback<ListRenderItem<T>>(
    ({ item }) => {
      const style = ({ pressed }: PressableStateCallbackType) =>
        pressed ? [styles.option, styles.optionActive] : styles.option;

      return (
        <Pressable style={style} onPress={handlePress}>
          {isDropdownItem(item) ? (
            <Text numberOfLines={1} style={styles.optionLabel}>
              {item.label}
            </Text>
          ) : (
            renderItem?.(item)
          )}
        </Pressable>
      );
    },
    [handlePress, renderItem],
  );
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        activeOpacity={1}
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
        {SelectedOption}
        <SVGs.DownIcon color={colors.black} />
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="none">
        <Pressable style={styles.overlay} onPress={handlePress}>
          <View style={dropdownContainerStyle}>
            <View style={styles.pickerLabelContainer}>
              <Text style={[styles.pickerLabel, styles.pickerLabelActive]}>
                {label}
              </Text>
            </View>
            <FlatList
              contentContainerStyle={styles.flatListContentContainer}
              data={data}
              renderItem={renderOption}
              style={styles.flex}
              nestedScrollEnabled
              ItemSeparatorComponent={OptionsSeparator}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
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
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  optionActive: {
    backgroundColor: colors.magnolia,
  },
  optionLabel: {
    color: colors.grayDark2,
    fontFamily: fonts.TT_Regular,
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  optionsSeparator: {
    borderColor: colors.grayLight2,
    borderBottomWidth: 0.5,
  },
  overlay: {
    height: '100%',
    width: '100%',
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
  pickerLabelActive: {
    color: colors.purpleDark,
    fontFamily: fonts.TT_Bold,
  },
  pickerLabelContainer: {
    backgroundColor: colors.white,
    borderRadius: 2,
    left: 6,
    paddingHorizontal: 1,
    position: 'absolute',
    top: -8,
    zIndex: 999,
  },
});
