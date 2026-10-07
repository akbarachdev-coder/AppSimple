import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import type { IoniconName } from '@/constants/categories';
import { AccentSoft, Radius, type AccentTint } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TileSize = 'sm' | 'md' | 'lg';

const SIZES: Record<TileSize, { box: number; icon: number; radius: number }> = {
  sm: { box: 34, icon: 17, radius: Radius.sm },
  md: { box: 44, icon: 22, radius: Radius.md },
  lg: { box: 58, icon: 28, radius: Radius.lg },
};

interface IconTileProps {
  name: IoniconName;
  tint?: AccentTint;
  size?: TileSize;
  style?: StyleProp<ViewStyle>;
}

export function IconTile({ name, tint = 'primary', size = 'md', style }: IconTileProps) {
  const theme = useTheme();
  const dims = SIZES[size];

  return (
    <View
      style={[
        styles.tile,
        {
          width: dims.box,
          height: dims.box,
          borderRadius: dims.radius,
          backgroundColor: theme[AccentSoft[tint]],
        },
        style,
      ]}>
      <Ionicons name={name} size={dims.icon} color={theme[tint]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
