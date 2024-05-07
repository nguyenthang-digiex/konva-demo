import { useRef, useEffect, useState } from "react";
import { Text, Transformer, Group } from "react-konva";

const anchorList = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "middle-right",
    "middle-left",
];

export const TextBox = ({ ...restProps }) => {
    const [isSelected, setIsSelected] = useState(false);


    const groupRef = useRef();
    const transformerRef = useRef();
    const textRef = useRef();

    const textProps = {
        text: restProps.text,
    };

    useEffect(() => {
        if (isSelected) {
            transformerRef.current.nodes([groupRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);



    return (
        <>
            <Group
                ref={groupRef}
                draggable
                onClick={() => setIsSelected(!isSelected)}
                {...restProps}
            >
                <Text ref={textRef} x={0} y={0} padding={3} {...textProps} />
            </Group>

            {isSelected && (
                <Transformer
                    ref={transformerRef}
                    onTransformEnd={() => {
                        const tr = transformerRef.current;
                        const anchorName = tr.getActiveAnchor();
                        const fontSizeAnchors = [
                            "top-right",
                            "top-left",
                            "bottom-left",
                            "bottom-right",
                        ];
                        if (!tr) return;
                        tr.nodes().forEach((group) => {
                            const children = group.getChildren();
                            children.forEach((node) => {
                                const textNode = node;
                                if (node.className === "Text") {
                                    if (anchorName && fontSizeAnchors.includes(anchorName)) {
                                        const absScale = textNode.getAbsoluteScale();
                                        textNode.setAttrs({
                                            fontSize: textNode.fontSize() * absScale.x,
                                            width: textNode.width() * absScale.x,
                                            x: textNode.x() * absScale.x,
                                            y: textNode.y() * absScale.y,
                                            scaleX: 1,
                                            scaleY: 1,
                                        });
                                    }
                                }
                            });
                            group.scaleX(1);
                            group.scaleY(1);
                            group.getLayer().batchDraw();
                        });
                    }}
                    onTransform={() => {
                        const tr = transformerRef.current;
                        const anchorName = tr?.getActiveAnchor();
                        const widthAnchors = ["middle-right", "middle-left"];
                        if (!tr) return;
                        tr.nodes().forEach((group) => {
                            const children = group.getChildren();
                            children.forEach((node) => {
                                if (node.className === "Text") {
                                    const textNode = node;
                                    const absScale = textNode.getAbsoluteScale();
                                    if (widthAnchors.includes(anchorName)) {
                                        textNode.setAttrs({
                                            width: textNode.width() * absScale.x,
                                            x: textNode.x() * absScale.x,
                                            y: textNode.y() * absScale.y,
                                            scaleX: 1,
                                            scaleY: 1,
                                        });
                                    }
                                }
                            });
                            if (widthAnchors.includes(anchorName)) {
                                group.scaleX(1);
                                group.scaleY(1);
                                group.getLayer().batchDraw();
                            }
                        });
                    }}
                    enabledAnchors={anchorList}
                />
            )}
        </>
    );
};
