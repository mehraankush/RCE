export function createSlug(title) {

	const slug = title.replace(/\s+/g, "-").toLowerCase();
	const regex = /[^\w\d-]/g;

	return slug.replace(regex, "");
}