export function generateSlug(title: string) {
  return convertUnicodeToAscii(title).toLowerCase().replace(/ /g, "-").replace(/[^a-z0-9-]/g, "");
}

function convertUnicodeToAscii(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "-" + Math.random().toString(36).substring(2, 15);
}
