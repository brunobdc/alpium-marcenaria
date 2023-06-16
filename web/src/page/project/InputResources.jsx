import PropTypes from "prop-types"
import { useCallback, useState } from "react"

function AddResource({ resource, handleAddResource }) {
    const [quantity, setQuantity] = useState(1)

    return (
        <>
            <td className="border rounded p-2"><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></td>
            <td className="border rounded p-2"><button className="border rounded py-1 px-4" type="button" onClick={() => handleAddResource(resource, quantity)}>Adicionar</button></td>
        </>
    )
}

AddResource.propTypes = {
    resource: PropTypes.object.isRequired,
    handleAddResource: PropTypes.func.isRequired
}


function InputResources({ resources, setResources, setErrorMessage }) {
    const [searchName, setSearchName] = useState("")
    const [toAdd, setToAdd] = useState([])

    const handleSearchResources = useCallback(async () => {
        const response = await fetch(
            "http://localhost:3050/api/resource/by-name?" + new URLSearchParams({ name: searchName }).toString(),
            {
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }
        )

        if (response.status == 200) {
            setToAdd((await response.json()))
            return
        }

        setErrorMessage((await response.json()).error)
    }, [searchName, setErrorMessage])

    const handleAddResource = useCallback((resource, quantity) => {
        setResources({ ...resource, quantity })
    }, [setResources])

    return (
        <div className="p-2">
            <h3 className="text-lg font-bold">Recursos</h3>
            <div className="my-2">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="border rounded p-2">Nome</th>
                            <th className="border rounded p-2">Medida</th>
                            <th className="border rounded p-2">Preco</th>
                            <th className="border rounded p-2">Quantidade</th>
                            <th className="border rounded p-2">Custo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            resources.map((resource, index) => (
                                <tr key={`resource-added-${index}-${resource.id}`}>
                                    <td className="border rounded p-2">{resource.name}</td>
                                    <td className="border rounded p-2">{resource.uom}</td>
                                    <td className="border rounded p-2">{resource.price}</td>
                                    <td className="border rounded p-2">{resource.quantity}</td>
                                    <td className="border rounded p-2">{resource.price * resource.quantity}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="p-1 border rounded">
                <div className="w-full grid grid-cols-6">
                    <div className="col-span-4 flex flex-col p-2">
                        <label>Nome do Recurso</label>
                        <input className="w-full" type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                    </div>
                    <div>
                        <button className="border rounded py-1 px-4" type="button" onClick={handleSearchResources}>Procurar</button>
                    </div>
                    <div>
                        <button className="border rounded py-1 px-4" type="button" onClick={() => { setToAdd([]); setSearchName(""); }}>Limpar</button>
                    </div>
                </div>
                <div>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="border rounded p-2">Nome</th>
                                <th className="border rounded p-2">Medida</th>
                                <th className="border rounded p-2">Preco</th>
                                <th className="border rounded p-2">Quantidade</th>
                                <th className="border rounded p-2">Adicionar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                toAdd.map((resource, index) => (
                                    <tr key={`resource-to-add-${index}-${resource.id}`}>
                                        <td className="border rounded p-2">{resource.name}</td>
                                        <td className="border rounded p-2">{resource.uom}</td>
                                        <td className="border rounded p-2">{resource.price}</td>
                                        <AddResource resource={resource} handleAddResource={handleAddResource} />
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

InputResources.propTypes = {
    resources: PropTypes.array.isRequired,
    setResources: PropTypes.func.isRequired,
    setErrorMessage: PropTypes.func.isRequired
}

export default InputResources