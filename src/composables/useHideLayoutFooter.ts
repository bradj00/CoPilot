import { useThemeStore } from "@/stores/theme"
import { onBeforeMount, onBeforeUnmount } from "vue"

// :has() CSS relational pseudo-class not yet supported by Firefox
// (https://caniuse.com/css-has)
// at the moment this worker around permit to hide Layout Footer
const store = useThemeStore()

export function useHideLayoutFooter() {
	if (store.isFooterShown) {
		onBeforeMount(() => {
			store.setFooterShow(false)
		})
		onBeforeUnmount(() => {
			store.setFooterShow(true)
		})
	}
}
