import WishList from "../js/WishList.mjs";
import { loadHeaderFooter, qs } from "../js/utils.mjs";

// Load header and footer
loadHeaderFooter();

// Initialize wishlist
const wishlistElement = qs("#wishlist");
const wishlist = new WishList(wishlistElement);
wishlist.init();
