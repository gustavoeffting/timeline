# Timeline

1. Navigate to this project directory
2. Run `npm install` to install dependencies
3. Run `npm start` to initialize

## Features

- Edit item name by double clickling
- Zoom in, Zoom out and reset
- Expand timeline item, to start earlier or end later
- Move item box forward or backward by dragging and dropping (The table also adds new months when moving the item box outside the current table months).

## What you like about your implementation.
I think it's quite a complete implementation. I would say that what I most like in this type of feature is the user interaction, with hovers and small effects to give a smoothler experience to the final user. Features like this always require some small effort for the user to understand how to use it properly, so the easier the better.

## What you would change if you were going to do it again.
I would probably implement something with Motion. Thus, I could improve the animations and micro interactions, giving an even better experience to the user. Besides that, if I had more time, I would implement a mobile version for it. A date filter would also be nice. And another small detail that would improve the UX is to make the mouse follows the item box when moving up and down through the calendar. A Typescript version would be amazing too.

## How you made your design decisions. For example, if you looked at other timelines for inspiration, please note that.
I searched for some examples on web. The first results were not too similar to what I wanted, they were all vertical focused (Ant Design, Material UI, etc), so I searched for "calendar timelines" and then I found some interesting solutions. I've already implement a similar (but simpler) solution with Vue in the past, so I tried to do something similar to that.

## How you would test this if you had more time.
I would start with unit testing for the utility functions as some of them can be tricky (e.g. getXPosition and generateMonthMarkers). I would test the lane assignment and verify overlapping items. I would also test if the states are being properly updated after moving or resizing. After that, I would do component tests for the overall funcionality, so test correct rendering based on props, verify tooltip content, test if CSS is being applied correctly. Besides that, I would do some testing with large data sets to check for edge cases. The test stack would probably be: Jest, React-testing-library and Cypress for e2e.