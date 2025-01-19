import { useEffect, useState } from 'react'

/**
 * 
 * @param dataPointCount 统计数据的点数, 超出或少于时, 填充处理表格
 */
export function useStatistics(dataPointCount: number): Statistics[] {
  const [value, setValue] = useState<Statistics[]>([])

  useEffect(() => {
    // ipcOn 返回了一个取消挂载的方法
    const unsub = window.electron.subscribeStatistics(stats =>  
      setValue(prev => { 
        const newData = [...prev, stats]
        if (newData.length > dataPointCount) {
          newData.shift()
        }

        return newData
      })
    )
    return unsub
  }, [ dataPointCount ])

  return value
}