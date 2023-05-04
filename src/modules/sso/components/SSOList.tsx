import React, { memo, useCallback } from 'react';
import { FlatList, FlatListProps, ListRenderItem } from 'react-native';

import { SSOModel } from '../stores/SelectSSOStore';
import SSOListItem from './SSOListItem';

export interface SSOListProps
  extends Omit<FlatListProps<SSOModel>, 'renderItem'> {
  selectedSSOId?: number;
  onPressItem?: (item: SSOModel) => void;
}

const keyExtractor = (item: SSOModel) => String(item.pisaId);

const SSOList: React.FC<SSOListProps> = ({
  selectedSSOId,
  onPressItem,
  ...props
}) => {
  const renderItem = useCallback<ListRenderItem<SSOModel>>(
    ({ item }) => {
      const isSelected = item.pisaId === selectedSSOId;

      return (
        <SSOListItem
          item={item}
          isSelected={isSelected}
          onPressItem={onPressItem}
        />
      );
    },
    [onPressItem, selectedSSOId],
  );

  return (
    <FlatList keyExtractor={keyExtractor} renderItem={renderItem} {...props} />
  );
};

export default memo(SSOList);
