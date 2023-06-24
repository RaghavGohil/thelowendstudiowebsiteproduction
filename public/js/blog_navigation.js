function getPageParamURL()
{
    const url = new URL(window.location.href)

    // get the value of the query parameter to be edited
    const paramValue = parseInt(url.searchParams.get('page'))
    
    return paramValue
}

function setPageParamURL(newval)
{
    const url = new URL(window.location.href)

    // update the value of the query parameter
    url.searchParams.set('page', newval)

    // update the URL of the current page
    window.history.pushState({}, '', url)
}

let pageIndex = parseInt(getPageParamURL()) || 1

let pageHighBoundary = 1

// highest boundary gets nothing but the number of pages
async function getNumberOfPages()
{
    await fetch('/blogs', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(res=>
        res.json())
    .then(data=> // returns the actual data because res.json is a promise.
    {
        pageHighBoundary = data.pageHighBoundary
        return {pageHighBoundary}
    })
    .catch(err => {
        console.error(err)
    })
}

getNumberOfPages().catch(err=>console.log(err))

function previous()
{
    if(pageIndex>1)
    {
        pageIndex -= 1
        setPageParamURL(pageIndex)
        scroll(0,0)
        window.location.reload()
    }
}

function next()
{
    if(pageIndex<pageHighBoundary)
    {
        pageIndex += 1
        setPageParamURL(pageIndex)
        scroll(0,0)
        window.location.reload()
    }
}