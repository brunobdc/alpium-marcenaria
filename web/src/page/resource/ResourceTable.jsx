import PropTypes from "prop-types"

function ResourceTable({ resources }) {
    return (
        <div className="w-3/4 border rounded p-2">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="border rounded p-2">Nome</th>
                        <th className="border rounded p-2">Medida</th>
                        <th className="border rounded p-2">Preco</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        resources.map((resource, index) => (
                            <tr key={`resource-${index}-${resource.id}`}>
                                <td className="border rounded p-2">{resource.name}</td>
                                <td className="border rounded p-2">{resource.uom}</td>
                                <td className="border rounded p-2">{resource.price}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

ResourceTable.propTypes = {
    resources: PropTypes.array.isRequired
}

export default ResourceTable