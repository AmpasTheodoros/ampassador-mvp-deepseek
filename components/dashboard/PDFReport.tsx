// components/PDFReport.tsx
'use client'
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer'

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  taskItem: {
    fontSize: 12,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 8,
  },
  completed: {
    color: '#22c55e',
  },
  pending: {
    color: '#ef4444',
  },
})

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
}

export type PDFReportProps = {
  industry: string;
  tasks: Task[];
}

export function PDFReport({ industry, tasks }: PDFReportProps) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>{industry} Compliance Report</Text>
        
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Text style={task.completed ? styles.completed : styles.pending}>
              {task.completed ? '✓' : '✗'}
            </Text>
            <Text>
              {task.title} - Due: {task.dueDate.toLocaleDateString()}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}