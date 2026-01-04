import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Button,
  RefreshControl,
  Alert,
} from 'react-native';
import { getTasks, saveTasks } from '../utile/storage';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(false);

      const cached = await getTasks();
      if (cached) {
        setTasks(cached);
        // setLoading(false);
        return;
      }

      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
      saveTasks(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, []),
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'COMPLETED') return task.completed;
    if (filter === 'INCOMPLETE') return !task.completed;
    return true;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Oops! Failed to fetch tasks.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTasks}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefresh}
        ></TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {['ALL', 'COMPLETED', 'INCOMPLETE'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.activeFilterText,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Details', { task: item })}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              <Text style={styles.icon}>{item.completed ? '✅' : '⭕'}</Text>
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.completed
                      ? styles.completedBadge
                      : styles.incompleteBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {item.completed ? 'Completed' : 'Incomplete'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f1f1f1ff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingLeft: 160,
  },
  refreshButton: { padding: 8 },
  refreshButtonText: { fontSize: 16, color: '#007AFF' },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeFilter: { backgroundColor: '#007AFF' },
  filterText: { fontSize: 16, color: '#333' },
  activeFilterText: { color: '#FFFFFF', fontWeight: 'bold' },
  listContainer: { paddingBottom: 20 },
  item: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  icon: { fontSize: 22, marginRight: 15 },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  completedBadge: { backgroundColor: '#D4EDDA' },
  incompleteBadge: { backgroundColor: '#F8D7DA' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorIcon: { fontSize: 48, marginBottom: 10 },
  errorText: { fontSize: 18, color: '#333', marginBottom: 20 },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
