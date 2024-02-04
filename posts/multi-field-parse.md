---
title: 'Dynamically Generated Fields Based on Delimitered Input'
image: '/images/multi-inputs-paste-result.gif'
excerpt: 'Taking your UX game up a notch.'
date: '2023-07-20'
tags: 
    - 'tutorial'
    - 'web-dev'
---
## How does it look like in action?
This type of form can be seen in sites where you're expected to paste in semi-structured inputs like a collection of environment variables:
```.env
env_var_1=abc123
env_var_2=def456
env_var_3=ghi789
```
On Vercel, this is what it would look like when you copy and paste the above text into their Environment Variables form:
![](/images/vercel_example.gif)
In case it's not clear, what happens here is that the form obtains your whole text and automagically fills them into newly-generated fields.

## How to implement this?
This looks fancy, but it is quite simple to implement. This post will show you how to do this in React. I am also using `react-hook-form` for handling forms, but the general idea is applicable to plain React or any other form solutions you might use.

To achieve this effect, we need to use React's [onPaste](https://react.dev/reference/react-dom/components/common#common-props) API, which is a wrapper around HTML's paste event and the [clipBoardEvent handler](https://react.dev/reference/react-dom/components/common#clipboardevent-handler).

The idea is to obtain the current clipboard value when an onPaste event is triggered:
```jsx
<Input onPaste={(e) => handlePaste(e as unknown as ClipboardEvent)} />
```

Once you have captured the clipboard value, we can now do the necessary processing in `handlePaste` and separate the input into an array of objects. You can only accept a specific delimiter. For the purposes of this post, we will be simulating a copy and paste input from an Excel spreadsheet which uses the `\t` and `\n` delimiters to represent the columns and carriage returns respectively:
```typescript
const result: pasteObject = [];
const { clipboardData } = e;
const pasteData = clipboardData?.getData("text")

if (pasteData) {
    const pasteDataArray = pasteData.split("\r\n");
    
    for (let i = 0; i < pasteDataArray.length; i++) {
        if (pasteDataArray[i] != undefined) {
            // Form column names are ID and quantity here
            const [id, qty] = pasteDataArray[i].split("\t");
            if (id && qty) {
                result.push({ lotId: id, quantity: qty });
            }
        }
    }            
}
```

Next, with this array of objects, we can dynamically generate the necessary fields based on the size of our array. If you're using `react-hook-form`, we can do this by iterating over our array and using the `update` and `setFieldArrayLength` APIs to set the field values and increase the number of fields respectively:
```typescript
for (let r = 0; r < result.length; r++) {
    console.log(r)
    const lotId = result[r]?.lotId;
    const quantity = result[r]?.quantity;
    if (lotId && quantity) {
        update(r+fieldArrayLength-1, {lotId: lotId, quantity: quantity});
        if(r>0) { // Offset as we're pasting starting from the first field that's already generated
            setFieldArrayLength((p) => p+1);
        }
    }
}
```
If you are not using `react-hook-form`, one way you could achieve the same is by iteratively generating the HTML input tag and setting their values to the respective `lotId` and `quantity` values.

And that's practically it. Here's what the full implementation of the `handlePaste` function looks like, along with the usual TypeScript flourishes.
```typescript
function handlePaste(e: ClipboardEvent) {
    type pasteObject = {
        lotId?: string,
        quantity?: string
    }[]

    const result: pasteObject = [];
    const { clipboardData } = e;
    const rawLotData = clipboardData?.getData("text")

    if (rawLotData) {
        const rawLotDataArray = rawLotData.split("\r\n");
        
        for (let i = 0; i < rawLotDataArray.length; i++) {
            if (rawLotDataArray[i] != undefined) {
                const [id, qty] = rawLotDataArray[i].split("\t");
                if (id && qty) {
                    result.push({ lotId: id, quantity: qty });
                }
            }
        }            
    }

    for (let r = 0; r < result.length; r++) {
        console.log(r)
        const lotId = result[r]?.lotId;
        const quantity = result[r]?.quantity;
        if (lotId && quantity) {
            update(r+fieldArrayLength-1, {lotId: lotId, quantity: quantity});
            if(r>0) {
                setFieldArrayLength((p) => p+1);
            }
        }
    }
}
```

Once we put them all together, we will get something like the following:
![](/images/multi-inputs-paste-result.gif)

Despite being simple to implement, this greatly improves the end user experience as they do not have to repetitively copy and paste each value into the form. 

So the next time you have a collection of repetitive form fields for your user to field, consider implementing this to easily take your UX game up a notch!
