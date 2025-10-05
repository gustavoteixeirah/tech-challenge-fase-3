import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

type IconCheckProps = {
    checked: boolean;
};

export const IconCheck: React.FC<IconCheckProps> = ({ checked }) => {
    return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="12" fill={checked ? '#00F4BF' : 'white'} />
            <Path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#021123" />
        </Svg>
    )
}

export const IconPencil: React.FC = () => {
    return (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <Path d="M17.7188 4.03125L15.8906 5.85938L12.1406 2.10938L13.9688 0.28125C14.1562 0.09375 14.3906 0 14.6719 0C14.9531 0 15.1875 0.09375 15.375 0.28125L17.7188 2.625C17.9062 2.8125 18 3.04688 18 3.32812C18 3.60938 17.9062 3.84375 17.7188 4.03125ZM0 14.25L11.0625 3.1875L14.8125 6.9375L3.75 18H0V14.25Z" fill="#ffffff" />
        </Svg>
    )
}

export const IconTrash: React.FC = () => {
    return (
        <Svg width="14" height="18" viewBox="0 0 14 18" fill="none">
            <Path d="M13.9844 0.984375V3H0.015625V0.984375H3.48438L4.51562 0H9.48438L10.5156 0.984375H13.9844ZM1 15.9844V3.98438H13V15.9844C13 16.5156 12.7969 16.9844 12.3906 17.3906C11.9844 17.7969 11.5156 18 10.9844 18H3.01562C2.48438 18 2.01562 17.7969 1.60938 17.3906C1.20312 16.9844 1 16.5156 1 15.9844Z" fill="#FFF" />
        </Svg>
    )
}