import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getTasks, saveTasks } from '../utile/storage';

export default function DetailScreen({ route, navigation }) {
  const [task, setTask] = useState(route.params.task);
  const [isToggling, setIsToggling] = useState(false);

  const toggleStatus = () => {
    Alert.alert(
      'Confirm Action',
      `Mark this task as ${task.completed ? 'Incomplete' : 'Completed'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setIsToggling(true);

              const updatedTask = { ...task, completed: !task.completed };
              setTask(updatedTask);

              const tasks = await getTasks();
              if (!tasks) return;

              const updatedTasks = tasks.map(t =>
                t.id === updatedTask.id ? updatedTask : t,
              );

              await saveTasks(updatedTasks);

              setIsToggling(false);

              //navigation.goBack();
            } catch (error) {
              setIsToggling(false);
              Alert.alert('Error', 'Failed to update task');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.detailRow}>
          <Text style={styles.icon}>📝</Text>
          <View style={styles.detailContent}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>{task.title}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.icon}>👤</Text>
          <View style={styles.detailContent}>
            <Text style={styles.label}>User ID</Text>
            <Text style={styles.value}>{task.userId}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.icon}>{task.completed ? '✅' : '⭕'}</Text>
          <View style={styles.detailContent}>
            <Text style={styles.label}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                task.completed ? styles.completedBadge : styles.incompleteBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {task.completed ? 'Completed' : 'Incomplete'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.toggleButton, isToggling && styles.disabledButton]}
        onPress={toggleStatus}
        disabled={isToggling}
      >
        <Text style={styles.toggleButtonText}>
          {isToggling
            ? 'Updating...'
            : `Mark as ${task.completed ? 'Incomplete' : 'Completed'}`}
        </Text>
        <Text style={styles.toggleIcon}>{task.completed ? '❌' : '✔️'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: { marginRight: 15 },
  backButtonText: { fontSize: 16, color: '#007AFF' },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    paddingLeft: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: { fontSize: 24, marginRight: 15 },
  detailContent: { flex: 1 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 5 },
  value: { fontSize: 16, color: '#333' },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  completedBadge: { backgroundColor: '#D4EDDA' },
  incompleteBadge: { backgroundColor: '#F8D7DA' },
  statusText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: { backgroundColor: '#CCC' },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  toggleIcon: { fontSize: 18 },
});
