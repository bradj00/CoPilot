import { type Edition, type RevoGrid } from "@revolist/revogrid/dist/types/interfaces.d"
import { type VNode } from "@revolist/revogrid/dist/types/stencil-public-runtime.d"
import icon from "./arrow.svg?url"

const ColumnRenderer = (h: any, { model, prop }: any): any[] => {
	const val = model[prop]
	return h(
		"span",
		{
			style: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center"
			}
		},
		[
			val,
			h("img", {
				width: 18,
				src: icon
			})
		]
	)
}

class SelectEditor implements Edition.EditorBase {
	public element: Element | null = null
	public editCell: Edition.EditCell | undefined

	constructor(
		public column: RevoGrid.ColumnRegular,
		private saveCallback: (value: any) => void,
		private closeCallback: () => void
	) {}

	// optional, called after editor rendered
	componentDidRender() {}

	// optional, called after editor destroyed
	disconnectedCallback() {}

	render(createComponent: RevoGrid.HyperFunc<VNode>) {
		let val = ""
		if (this?.editCell) {
			const model = this?.editCell.model || {}
			val = model[this?.editCell?.prop] || ""
		}

		const options = []
		if (this.column?.source?.length) {
			for (const source of this.column.source) {
				options.push(
					createComponent(
						"option",
						{
							value: source,
							selected: source === val
						},
						source
					)
				)
			}
		}

		return createComponent(
			"select",
			{
				value: val,
				style: {
					margin: "0 15px",
					width: " calc(100% - 30px)",
					height: "100%"
				},
				onChange: (event: Event) => {
					const inputElement = event.target as HTMLInputElement
					this.saveCallback(inputElement?.value)
				}
			},
			options
		)
	}
}

export default class ColumnType {
	constructor() {}

	readonly editor = SelectEditor

	readonly cellTemplate = ColumnRenderer
}
