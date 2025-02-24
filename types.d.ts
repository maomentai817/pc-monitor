// 渲染进程和 ipc 所需的类型声明文件
type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
}

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
}

type FrameWindowAction = 'CLOSE' | 'MINIMIZE' | 'MAXIMIZE' | 'UNMAXIMIZE'

type View = 'CPU' | 'RAM' | 'STORAGE';

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  sendFrameAction: FrameWindowAction;
}

type UnsubscribeFuction = () => void;

interface Window { 
  electron: {
    subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFuction;
    getStaticData: () => Promise<StaticData>;
    subscribeChangeView: (callback: (view: View) => void) => UnsubscribeFuction;
    sendFrameAction: (payload: FrameWindowAction) => void;
  }
}