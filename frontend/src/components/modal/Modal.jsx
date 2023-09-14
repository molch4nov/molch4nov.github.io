import "./modal.css"

export function Modal({active, setActive, children}) {
    return (
        <div className={active ? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <p className="modal__text">{children}</p>
            </div>
        </div>
    )
}
