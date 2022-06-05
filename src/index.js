// these are the variables you can use as inputs to your algorithms
// console.log("fxhash: " + fxhash)   // the 64 chars hex number fed to your algorithm
// console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
window.$fxhashFeatures = {
    "Palette": PALETTE,
    "Number of elements": NUMBEROFELEMENTS_LABEL,
    "Brush size": BRUSHLENGTHANDBREADTH_LABEL,
    "Stroke size": BRUSHSTROKESIZE_LABEL,
    "Brush angle noise": BRUSHANGLENOISE_LABEL,
    "Brush fibre sparseness": BRUSHFIBRESPARSENESS_LABEL,
    "Fibre rotation noise": FIBREROTATIONNOISE_LABEL,
}


// this code writes the values to the DOM as an example
// const containero = document.createElement("div")
// containero.innerText = `
//   random hash: ${fxhash} \n
//   some pseudo random values: [${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ... ]\n
// `
// document.body.prepend(containero)