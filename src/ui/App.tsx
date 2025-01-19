import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { useStatistics } from './useStatistics'
import { Chart } from './Chart'


// 全屏判断
let isFullScreen = false;
function App() {
  const statistics = useStatistics(10)

  const [activeView, setActiveView] = useState<View>('CPU')
  // 计算属性
  const cpuUsages = useMemo(() => statistics.map(stat => stat.cpuUsage), [statistics])
  const ramUsages = useMemo(() => statistics.map(stat => stat.ramUsage), [statistics])
  const storageUsages = useMemo(() => statistics.map(stat => stat.storageUsage), [statistics])

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case 'CPU':
        return cpuUsages
      case 'RAM':
        return ramUsages
      case 'STORAGE':
        return storageUsages
      default:
        return cpuUsages
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages])

  useEffect(() => { 
    return window.electron.subscribeChangeView((view) => setActiveView(view))
  }, [])

  const staticData = useStaticData()

  return (
    <div className="App">
      <Header />
      <div className="main">
        <div>
          <SelectOption
            onClick={() => setActiveView('CPU')}
            title="CPU"
            view="CPU"
            subTitle={staticData?.cpuModel ?? ''}
            data={cpuUsages}
          />
          <SelectOption
            onClick={() => setActiveView('RAM')}
            title="RAM"
            view="RAM"
            subTitle={(staticData?.totalMemoryGB.toString() ?? '') + ' GB'}
            data={ramUsages}
          />
          <SelectOption
            onClick={() => setActiveView('STORAGE')}
            title="STORAGE"
            view="STORAGE"
            subTitle={(staticData?.totalStorage.toString() ?? '') + ' GB'}
            data={storageUsages}
          />
        </div>
        <div className="mainGrid">
          <Chart
            selectedView={activeView}
            data={activeUsages}
            maxDataPoints={10}
          />
        </div>
      </div>
    </div>
  )
}

function SelectOption(props: {
  title: string;
  view: View;
  subTitle: string;
  data: number[];
  onClick: () => void;
}) {
  return (
    <button className="selectOption" onClick={props.onClick}>
      <div className="selectOptionTitle">
        <div>{props.title}</div>
        <div>{props.subTitle}</div>
      </div>
      <div className="selectOptionChart">
        <Chart selectedView={props.view} data={props.data} maxDataPoints={10} />
      </div>
    </button>
  );
}

function Header() {
  // 是否全屏
  const handleFullScreen = () => {
    if (isFullScreen) {
      window.electron.sendFrameAction('UNMAXIMIZE');
    } else {
      window.electron.sendFrameAction('MAXIMIZE');
    }
    isFullScreen = !isFullScreen;
  }

  return (
    <header>
      <div
        id="close"
        className='operate-btn'
        onClick={() => window.electron.sendFrameAction('CLOSE')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
        >
          <g id="close_line" fill="none" fill-rule="evenodd">
            <path
              d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
            />
            <path
              fill="#0000005f"
              d="m12 13.414 5.657 5.657a1 1 0 0 0 1.414-1.414L13.414 12l5.657-5.657a1 1 0 0 0-1.414-1.414L12 10.586 6.343 4.929A1 1 0 0 0 4.93 6.343L10.586 12l-5.657 5.657a1 1 0 1 0 1.414 1.414z"
            />
          </g>
        </svg>
      </div>
      <div
        id="minimize"
        className='operate-btn'
        onClick={() => window.electron.sendFrameAction('MINIMIZE')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
        >
          <g id="minimize_line" fill="none" fill-rule="evenodd">
            <path
              d="M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z"
            />
            <path
              fill="#0000005f"
              d="M3 12a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1"
            />
          </g>
        </svg>
      </div>
      {!isFullScreen && <div
        id="maximize"
        className='operate-btn'
        onClick={handleFullScreen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
        >
          <g id="fullscreen_2_line" fill="none" fill-rule="nonzero">
            <path
              d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z"
            />
            <path
              fill="#0000005f"
              d="M9.793 12.793a1 1 0 0 1 1.497 1.32l-.083.094L6.414 19H9a1 1 0 0 1 .117 1.993L9 21H4a1 1 0 0 1-.993-.883L3 20v-5a1 1 0 0 1 1.993-.117L5 15v2.586l4.793-4.793ZM20 3a1 1 0 0 1 .993.883L21 4v5a1 1 0 0 1-1.993.117L19 9V6.414l-4.793 4.793a1 1 0 0 1-1.497-1.32l.083-.094L17.586 5H15a1 1 0 0 1-.117-1.993L15 3h5Z"
            />
          </g>
        </svg>
      </div>}
      {isFullScreen && <div
        id="maximize"
        className='operate-btn'
        onClick={handleFullScreen}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='14'
          height='14'
          viewBox='0 0 24 24'
        >
          <g id="fullscreen_exit_2_line" fill='none' fill-rule='nonzero'>
            <path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z' />
            <path fill='#0000005f' d='M11 12a1 1 0 0 1 .993.883L12 13v5a1 1 0 0 1-1.993.117L10 18v-2.586l-5.293 5.293a1 1 0 0 1-1.497-1.32l.083-.094L8.586 14H6a1 1 0 0 1-.117-1.993L6 12h5Zm8.293-8.707a1 1 0 0 1 1.497 1.32l-.083.094L15.414 10H18a1 1 0 0 1 .117 1.993L18 12h-5a1 1 0 0 1-.993-.883L12 11V6a1 1 0 0 1 1.993-.117L14 6v2.586l5.293-5.293Z' />
          </g>
        </svg>
      </div>}
    </header>
  );
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}


export default App
