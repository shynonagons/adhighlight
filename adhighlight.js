function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const color = 'red';
const width = 3;
const currentSite = window.location.host
  .split('.')
  .find(part => !part.includes('www'));

const sponsoredContentOverlay = `<div style="position: absolute; background: rgba(255,0,0,0.6); z-index:5; font-size: 24px; display: flex; align-items: center; justify-content: center; flex-flow: column; width: 100%;height:100%;color:white;"><img style='width: 200px;' src='https://d3cdo0emj8d2qc.cloudfront.net/assets/23e1fb3b6336be1dd7c158602439c13ec921862a.png' />Sponsored content, I cast thee out</div>`;

function highlightAds(site) {
  switch (site) {
    case 'twitter':
      return document
        .querySelectorAll('div[data-testid=placementTracking]')
        .forEach(domNode => {
          if (
            domNode.innerHTML.includes('Promoted') &&
            !domNode.attributes['data-contenthighlighted']
          ) {
            domNode.attributes['data-contenthighlighted'] = true;
            domNode.innerHTML = sponsoredContentOverlay + domNode.innerHTML;
            domNode.style.border = `${width}px solid ${color}`;
          }
        });
    case 'facebook':
      return document
        .querySelectorAll('div[role*="article"]')
        .forEach(domNode => {
          console.log(domNode.innerHTML)
          if (
            (domNode.innerHTML.includes('Sponsored') ||
              domNode.innerHTML.includes('Suggested for You')) &&
            !domNode.attributes['data-contenthighlighted']
          ) {
            domNode.attributes['data-contenthighlighted'] = true;
            domNode.innerHTML = sponsoredContentOverlay + domNode.innerHTML;
            domNode.style.border = `${width}px solid ${color}`;
          }
        });
    case 'amazon':
      return document
        .querySelectorAll('div[data-component-type=sp-sponsored-result]')
        .forEach(
          domNode => (domNode.style.border = `${width}px solid ${color}`)
        );

    default:
      return;
  }
}

window.onload = function() {
  highlightAds(currentSite);
};

document.onscroll = function() {
  debounce(highlightAds(currentSite), 250, true);
};
