import PropTypes from "prop-types"
import { useCallback, useState } from "react"
import InputResources from "./InputResources"

function NewProject({ refresh, setErrorMessage }) {
    const [project, setProject] = useState({ resources: [] })

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault()
        const response = await fetch(
            "http://localhost:3050/api/project",
            {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ ...project, resources: project.resources.map(r => ({ ...r, id: r.id.toString(), quantity: r.quantity.toString() })) })
            }
        )

        if (response.status == 200) {
            setProject({ resources: [] })
            refresh()
            return
        }

        setErrorMessage((await response.json()).error)
    }, [project, refresh, setErrorMessage])

    const getCost = useCallback(() => {
        let sum = 0
        for (const resource of project.resources) {
            sum += resource.quantity * resource.price
        }
        return sum
    }, [project])

    return <div className="w-3/4 border rounded p-2 mb-2">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
            <span className="flex flex-col p-2">
                <label>Nome</label>
                <input type="text" value={project.name} onChange={(e) => setProject(previous => ({ ...previous, name: e.target.value }))} />
            </span>
            <span className="flex flex-col p-2">
                <label>Custo Total</label>
                <input type="text" disabled value={getCost()} />
            </span>
            <span className="border rounded col-span-2">
                <InputResources
                    resources={project.resources}
                    setResources={(resource) => setProject(previous => ({ ...previous, resources: [...previous.resources, resource] }))}
                    setErrorMessage={setErrorMessage}
                />
            </span>

            <button className="border rounded py-1 px-4" type="submit">Criar</button>
        </form>
    </div>
}

NewProject.propTypes = {
    refresh: PropTypes.func.isRequired,
    setErrorMessage: PropTypes.func.isRequired
}

export default NewProject