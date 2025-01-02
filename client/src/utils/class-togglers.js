export const toggleHomeNavOnBody = (isEnable = false) => {
	if (isEnable) document.body.classList.add("home-nav");
	else document.body.classList.remove("home-nav");
};
