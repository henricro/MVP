window.addEventListener('load', () => {
    const desiredScrollPosition = (document.body.scrollHeight - window.innerHeight) / 2;
    window.scrollTo(0, desiredScrollPosition);
});

//console.log("viewport");