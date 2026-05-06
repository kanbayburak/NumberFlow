import { StyleSheet, Text, View } from 'react-native';

type Props = {
  value: number | null;
  wallTop: boolean;
  wallRight: boolean;
  wallBottom: boolean;
  wallLeft: boolean;
  isOnPath: boolean;
};

export function GridCell({
  value,
  wallTop,
  wallRight,
  wallBottom,
  wallLeft,
  isOnPath,
}: Props) {
  const wallW = 3;
  return (
    <View
      style={[
        styles.cell,
        {
          borderTopWidth: wallTop ? wallW : StyleSheet.hairlineWidth,
          borderRightWidth: wallRight ? wallW : StyleSheet.hairlineWidth,
          borderBottomWidth: wallBottom ? wallW : StyleSheet.hairlineWidth,
          borderLeftWidth: wallLeft ? wallW : StyleSheet.hairlineWidth,
          backgroundColor: isOnPath ? '#dbeafe' : '#ffffff',
        },
      ]}>
      {value !== null ? (
        <Text style={styles.number}>{value}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#64748b',
  },
  number: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
});
