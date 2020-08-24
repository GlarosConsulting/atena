function getTextBySelector(selector, parent = document) {
  const htmlElement = parent.querySelector(selector);

  if(!htmlElement) return undefined;

  return htmlElement.innerText;
}

export default getTextBySelector;
