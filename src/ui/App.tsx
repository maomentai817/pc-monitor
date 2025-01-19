import { useMemo } from 'react'
import './App.css'
import { useStatistics } from './useStatistics'
import { Chart } from './Chart'

function App() {
  const statistics = useStatistics(10)
  // 计算属性
  const cpuUsages = useMemo(() => statistics.map(stat => stat.cpuUsage), [statistics])
  const ramUsages = useMemo(() => statistics.map(stat => stat.ramUsage), [statistics])
  const storageUsages = useMemo(() => statistics.map(stat => stat.storageUsage), [statistics])

  return (
    <div className="App">
      <div style={{ height: 120 }}>
        <Chart data={cpuUsages} maxDataPoints={10} />
      </div>
    </div>
  )
}

export default App
