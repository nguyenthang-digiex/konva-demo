import React, {useEffect, useRef, useState} from 'react';
import {Group, Layer, Stage, Text, Transformer} from 'react-konva';

const colors = [
    '#FF5733', '#FFBD33', '#000000', '#33B5FF', '#5733FF',
    '#BD33FF', '#FF33B5', '#33FFE6', '#FF3386', '#33FFC7',
];

const anchorList = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "middle-right",
    "middle-left",
];

function generateShapes() {
    const inputString = "Because adulthood doesn't have to be boring.";
    const charArray = inputString.split('');

    return charArray.map((char, i) => {
        const colorIndex = Math.floor(Math.random() * colors.length);

        return {
            id: i.toString(),
            x: i * 20,
            y: 50,
            isDragging: false,
            color: colors[colorIndex],
            text: char,
        };
    });
}

const INITIAL_STATE = generateShapes();

const App = () => {
    const [isSelected, setIsSelected] = useState(false);

    const groupRef = useRef();
    const textRef = useRef();
    const transformerRef = useRef();

    const handleTransformEnd = () => {
        const tr = transformerRef.current;
        const anchorName = tr?.getActiveAnchor();

        const fontSizeAnchors = ['top-right', 'top-left', 'bottom-left', 'bottom-right'];

        if (!tr) return;
        tr?.nodes().forEach((group) => {
            const children = group.getChildren();
            let maxHeight = 0;
            children.forEach((node) => {
                const textNode = node;
                if (node.getClassName() === 'Text') {
                    const absScale = textNode.getAbsoluteScale();
                    if (anchorName && fontSizeAnchors.includes(anchorName)) {
                        textNode.setAttrs({
                            fontSize: textNode?.fontSize() * absScale.x,
                            width: textNode.width(),
                            height: textNode.height(),
                            x: textNode.x() * absScale.x,
                            y: textNode.y() * absScale.y,
                            scaleX: 1,
                            scaleY: 1
                        });
                    }
                    maxHeight = Math.max(maxHeight, textNode.height());
                }
            });
            group.height(maxHeight + maxHeight);
            group.scaleX(1);
            group.scaleY(1);
            group.getLayer().batchDraw();
        });
    };

    const handleTransform = () => {
        const tr = transformerRef.current;
        const anchorName = tr?.getActiveAnchor();

        const widthAnchors = ["middle-right", "middle-left"];

        if (!tr) return;
        tr?.nodes().forEach((group) => {
            const children = group.getChildren();

            let maxHeight = 0;
            children.forEach((node) => {
                if (node.className === "Text") {
                    const textNode = node;
                    const absScale = textNode.getAbsoluteScale();

                    if (widthAnchors.includes(anchorName)) {
                        textNode.setAttrs({
                            width: textNode.width(),
                            height: textNode.height(),
                            x: textNode.x() * absScale.x,
                            y: textNode.y() * absScale.y,
                            scaleX: 1,
                            scaleY: 1,
                        });
                    }

                    maxHeight = Math.max(maxHeight, textNode.height());
                }
            });

            group.height(maxHeight + maxHeight);
            if (widthAnchors.includes(anchorName)) {
                group.scaleX(1);
                group.scaleY(1);
            }

            group.getLayer().batchDraw();
        });
    }


    useEffect(() => {
        if (isSelected) {
            transformerRef.current?.nodes([groupRef.current]);
            transformerRef.current?.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
        >
            <Layer>
                <>
                    <Group
                        ref={groupRef}
                        draggable
                        onClick={() => setIsSelected(!isSelected)}
                        x={50}
                        y={50}
                        width={535}
                        height={190}
                    >
                        {INITIAL_STATE.map((ele, i) => (
                            <Text
                                ref={textRef}
                                key={ele.id}
                                id={ele.id}
                                x={ele.x}
                                y={ele.y}
                                fill={ele.color}
                                text={ele.text}
                                fontSize={30}
                                align='left'
                                letterSpacing={0}
                                lineHeight={1}
                                padding={3}
                            />

                        ))}
                    </Group>
                    {isSelected && (
                        <Transformer
                            ref={transformerRef}
                            onTransform={handleTransform}
                            onTransformEnd={handleTransformEnd}
                            enabledAnchors={anchorList}
                        />
                    )}
                </>
            </Layer>
        </Stage>
    );
};

export default App;
