//fetch tokens from database
const keys = await (await fetch("https://fakeapi.com")).json()

//target selected frame
const target = selection()[0];

//import all style to the Figma file
//for performance optimization we associate all styles on a frame and import the frame into the existing file
const lightCarrier = await figma.importComponentByKeyAsync("key of light mode carrier")
const darkCarrier = await figma.importComponentByKeyAsync("key of dark mode carrier")
const udCarrier = await figma.importComponentByKeyAsync("key of ud token carrier")

if ("children" in target) {
    const layers = target.findAll()
    layers.map(async layer => {
        if ('fillStyleId' in layer && layer.fillStyleId !== "") {
            //find the fill style by name
            const token = keys.find(key => layer.fillStyleId.toString().includes(key.light))
            if (token) {
                //swaping color
                layer.fillStyleId = (await figma.importStyleByKeyAsync(token.dark)).id
            } else {
                //phantom style case workaround
                const key = layer.fillStyleId.toString().split(",")[0].split(":")[1]
                const style = await figma.importStyleByKeyAsync(key)
                const phantom = style.name.replace("(ig)", "").replace("🌞", "🌛")
                console.log(style)
                const phantomLayer = darkCarrier.children.find(item => item.name === phantom)
                console.log('pl', phantomLayer)
                if (phantomLayer && 'fillStyleId' in phantomLayer) {
                    console.log('equal', phantomLayer)
                    layer.fillStyleId = phantomLayer.fillStyleId
                }
            }
        } if ('strokeStyleId' in layer && layer.strokeStyleId !== "") {
            //find the stroke style by name
            const token = keys.find(key => layer.fillStyleId.toString().includes(key.light))
            if (token) {
                //swaping color
                layer.strokeStyleId = (await figma.importStyleByKeyAsync(token.dark)).id
            } else {
                //phantom style case workaround
                const key = layer.strokeStyleId.toString().split(",")[0].split(":")[1]
                const style = await figma.importStyleByKeyAsync(key)
                const phantom = style.name.replace("(ig)", "").replace("🌞", "🌛")
                const phantomLayer = darkCarrier.children.find(item => item.name === phantom)
                if (phantomLayer && 'fillStyleId' in phantomLayer) {
                    layer.strokeStyleId = phantomLayer.fillStyleId as string
                }
            }
        }
    })
}