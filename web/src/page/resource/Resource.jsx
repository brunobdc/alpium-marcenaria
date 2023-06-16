import { useCallback, useEffect, useState } from "react"
import ResourceTable from "./ResourceTable"

function Resource() {
    const [errorMessage, setErrorMessage] = useState()
    const [newResource, setNewResource] = useState({})
    const [refresh, setRefresh] = useState(true)
    const [resources, setResources] = useState([])

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        const response = await fetch(
            "http://localhost:3050/api/resource",
            {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(newResource)
            }
        )

        if (response.status == 200) {
            setNewResource({})
            setRefresh(true)
            setErrorMessage()
            return
        }

        setErrorMessage((await response.json()).error)
    }, [newResource])

    const getAllResources = useCallback(async () => {
        const response = await fetch(
            "http://localhost:3050/api/resource",
            {
                method: "GET",
                headers: { 'Content-Type': "application/json" },
            }
        )

        if (response.status == 200) {
            setResources((await response.json()))
            return
        }

        setErrorMessage((await response.json()).error)
    }, [])

    useEffect(() => {
        if (refresh) {
            getAllResources()
            setRefresh(false)
        }
    }, [refresh, getAllResources])

    return (
        <>
            <div className="w-3/4 border rounded p-2 mb-2">
                <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
                    <span className="flex flex-col p-2">
                        <label>Nome</label>
                        <input type="text" value={newResource.name} onChange={(e) => setNewResource(previous => ({ ...previous, name: e.target.value }))} />
                    </span>
                    <span className="flex flex-col p-2">
                        <label>Unidade de Medida</label>
                        <input type="text" value={newResource.uom} onChange={(e) => setNewResource(previous => ({ ...previous, uom: e.target.value }))} />
                    </span>
                    <span className="flex flex-col p-2">
                        <label>Preco por {newResource.uom ?? "Unidade"}</label>
                        <input type="text" value={newResource.price} onChange={(e) => setNewResource(previous => ({ ...previous, price: e.target.value }))} />
                    </span>
                    <div className="p-2">
                        <button type="submit" className="border rounded py-1 px-4">Criar</button>
                    </div>
                </form>
            </div>
            {
                errorMessage ?? <div className="mb-2">{errorMessage}</div>
            }
            <ResourceTable resources={resources} />
        </>
    )
}

export default Resource