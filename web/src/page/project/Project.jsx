import { useEffect, useState } from "react"
import NewProject from "./NewProject"
import ListProjects from "./ListProjects"

function Project() {
    const [errorMessage, setErrorMessage] = useState()
    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        if (refresh) {
            setRefresh(false)
        }
    }, [refresh])

    return (
        <>
            <NewProject refresh={() => setRefresh(true)} setErrorMessage={setErrorMessage} />
            {
                errorMessage ?? <div>{errorMessage}</div>
            }
            <ListProjects refresh={refresh} setErrorMessage={setErrorMessage} />
        </>
    )
}

export default Project