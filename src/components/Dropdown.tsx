import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  LayoutRectangle,
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
  placeholder?: string;
  selectedItem?: T;
  bottomOffset?: number;
  maxHeight?: number;
  disabled?: boolean;
  onSelect?: (item: T) => void;
  renderItem?: (item: T) => JSX.Element;
}

const isDropdownItem = <T,>(item?: DropdownItem | T): item is DropdownItem =>
  !!(item as DropdownItem)?.value;

const OptionsSeparator = () => <View style={styles.optionsSeparator} />;

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export const Dropdown = <T extends object | number | string = DropdownItem>({
  data,
  selectedItem,
  label,
  placeholder,
  bottomOffset = TOAST_OFFSET_ABOVE_SINGLE_BUTTON,
  maxHeight = 200,
  disabled,
  renderItem,
  style,
  onSelect,
}: Props<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerLayout, setPickerLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const pickerRef = useRef<TouchableOpacity>(null);

  const direction = useMemo<DropdownDirection>(() => {
    const size =
      pickerLayout.y + maxHeight + pickerLayout.height + bottomOffset;

    return size < WINDOW_HEIGHT
      ? DropdownDirection.TOP
      : DropdownDirection.BOTTOM;
  }, [bottomOffset, maxHeight, pickerLayout.height, pickerLayout.y]);

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.container, style],
    [style],
  );

  const pickerContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.pickerContainer, disabled && styles.pickerContainerDisabled],
    [disabled],
  );

  const dropdownContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.dropdownContainer,
      {
        [direction]:
          direction === DropdownDirection.BOTTOM
            ? WINDOW_HEIGHT - pickerLayout.y - pickerLayout.height
            : pickerLayout.y,
        left: pickerLayout.x,
        maxHeight,
        width: pickerLayout.width,
      },
    ],
    [
      direction,
      maxHeight,
      pickerLayout.height,
      pickerLayout.width,
      pickerLayout.x,
      pickerLayout.y,
    ],
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

    return <Text style={styles.optionLabel}>{placeholder}</Text>;
  }, [selectedItem, renderItem, placeholder]);

  const openDropdown = useCallback(async () => {
    const { x, y, width, height } = await new Promise<LayoutRectangle>(
      resolve =>
        pickerRef.current?.measureInWindow((x, y, width, height) =>
          resolve({ x, y, width, height }),
        ),
    );

    setPickerLayout({ x, y, width, height });
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  const renderOption = useCallback<ListRenderItem<T>>(
    ({ item }) => {
      const style = ({ pressed }: PressableStateCallbackType) =>
        pressed ? [styles.option, styles.optionActive] : styles.option;

      const handlePress = () => {
        onSelect?.(item);
        closeDropdown();
      };

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
    [closeDropdown, onSelect, renderItem],
  );
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={1}
        style={pickerContainerStyle}
        onPress={openDropdown}
        ref={pickerRef}
      >
        <View style={styles.pickerLabelContainer}>
          <Text style={styles.pickerLabel}>{label}</Text>
        </View>
        {SelectedOption}
        {!disabled && <SVGs.DownIcon color={colors.black} />}
      </TouchableOpacity>

      {isOpen && (
        <Modal transparent animationType="none">
          <TouchableOpacity
            activeOpacity={1}
            style={styles.overlay}
            onPress={closeDropdown}
          >
            <View style={dropdownContainerStyle}>
              <View style={styles.pickerLabelContainer}>
                <Text style={[styles.pickerLabel, styles.pickerLabelActive]}>
                  {label}
                </Text>
              </View>
              <FlatList
                data={data}
                renderItem={renderOption}
                nestedScrollEnabled
                ItemSeparatorComponent={OptionsSeparator}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    position: 'absolute',
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
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 11,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pickerContainerDisabled: {
    borderColor: colors.grayWithOpacity,
    backgroundColor: colors.grayWithOpacity,
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
    borderRadius: 8,
    left: 6,
    paddingHorizontal: 1,
    position: 'absolute',
    top: -8,
    zIndex: 1,
  },
});
