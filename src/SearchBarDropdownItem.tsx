export interface Actor {
  did: string;
  handle: string;
  displayName?: string;
}

function SearchBarDropdownItem(props: {actor: Actor, onClick: (actor: Actor) => void}) {
	return <>
    <div style={{cursor: "pointer"}} onClick={() => props.onClick(props.actor)}>
      @{props.actor.handle}
    </div>
  </>;
}

export default SearchBarDropdownItem;
