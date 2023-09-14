import './style.css'
export function namingForMap(count, name) {
    return (
        <div className="container_for_map_info">

            <div className="count_info">
                <p className="count_one">
                    <strong>{count}</strong>
                </p>
                <p className="count_two">
                    {name}
                </p>
            </div>

        </div>
    )
}
