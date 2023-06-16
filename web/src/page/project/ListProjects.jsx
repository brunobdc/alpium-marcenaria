import PropTypes from "prop-types"
import { useCallback, useEffect, useState } from "react"

function ListProjects({ refresh, setErrorMessage }) {
    const [projects, setProjects] = useState([])

    const getAllProjects = useCallback(async () => {
        const response = await fetch(
            "http://localhost:3050/api/project",
            {
                method: "GET",
                headers: { 'Content-Type': "application/json" },
            }
        )

        if (response.status == 200) {
            setProjects((await response.json()))
            return
        }

        setErrorMessage((await response.json()).error)

    }, [setErrorMessage])

    useEffect(() => {
        if (refresh) {
            getAllProjects()
        }
    }, [getAllProjects, refresh])

    return <div className="w-3/4 border rounded p-2">
        <table className="w-full">
            <thead>
                <tr>
                    <th className="border rounded p-2">Name</th>
                    <th className="border rounded p-2">Custo</th>
                </tr>
            </thead>
            <tbody>
                {projects.map((value, index) => (
                    <tr key={`project-${index}-${value.id}`}>
                        <td className="border rounded p-2">{value.name}</td>
                        <ProjectCost project={value} />
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}

ListProjects.propTypes = {
    refresh: PropTypes.bool.isRequired,
    setErrorMessage: PropTypes.func.isRequired
}

function ProjectCost({ project }) {
    const getCost = useCallback(() => {
        let sum = 0
        for (const resource of project.resources) {
            sum += resource.price * resource.quantity
        }

        return sum
    }, [project])

    return <td className="border rounded p-2">{getCost()}</td>
}

ProjectCost.propTypes = {
    project: PropTypes.object.isRequired
}

export default ListProjects