import osUtils from 'os-utils'
import fs from 'fs'
import os from 'os'

const POLLING_INTERVAL = 500

// 函数轮询, 500ms 更新资源
export const pollResource = () => { 
  setInterval(async () => {
    const cpuUsage = await getCpuUsage()
    const ramUsage = getRamUsage()
    const storageUsage = getStorageUsage()

    console.log({cpuUsage, ramUsage, storageUsage: storageUsage.usage})
  }, POLLING_INTERVAL)
}

// cpu 利用率 - 所有内核的总处理器利用率
const getCpuUsage = () => { 
  return new Promise(resovle => { 
    osUtils.cpuUsage(resovle)
  })
}

// 活动进程占用的物理内存
const getRamUsage = () => { 
  return 1 - osUtils.freememPercentage()
}

// 获取磁盘使用率 - C盘
const getStorageUsage = () => { 
  // require node 18
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C:\\' : '/')
  const total = stats.bsize * stats.blocks
  const free = stats.bsize * stats.bfree

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total
  }
}

// 获取静态资源数据
export const getStaticData = () => {
  const totalStorage = getStorageUsage().total
  const cpuModel = os.cpus()[0].model
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024)

  return { totalStorage, cpuModel, totalMemoryGB }
}