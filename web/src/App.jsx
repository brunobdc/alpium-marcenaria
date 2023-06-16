import { useState } from 'react'
import Project from './page/project/Project'
import Resource from './page/resource/Resource'

function App() {
  const [page, setPage] = useState("project")
  return (
    <div className='w-full h-full flex justify-center items-center mt-10'>
      <div className='flex w-3/4 flex-col border rounded-md'>
        <div className='w-full'>
          <button className={'w-1/2 p-2 text-xl' + (page == "project" ? ' font-bold border rounded-md' : "")} onClick={() => setPage("project")}>PROJECT</button>
          <button className={'w-1/2 p-2 text-xl' + (page == "resource" ? ' font-bold border rounded-md' : "")} onClick={() => setPage("resource")}>RESOURCE</button>
        </div>
        <div className='flex flex-col justify-center items-center my-5'>
          {page == "project" ? <Project /> : <Resource />}
        </div>
      </div>
    </div>
  )
}

export default App
