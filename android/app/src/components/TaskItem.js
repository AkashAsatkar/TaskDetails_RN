import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskItem({ task, onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>

        <View
          style={[
            styles.statusBadge,
            task.completed ? styles.completed : styles.incomplete,
          ]}
        >
          <Text style={styles.statusText}>
            {task.completed ? 'Completed' : 'Incomplete'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginRight: 10,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  completed: {
    backgroundColor: '#DCFCE7',
  },
  incomplete: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
});
