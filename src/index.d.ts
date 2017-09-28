/// <reference types="react" />
import { ReactType } from 'react';
export declare type Properties = {
    /**
     * Property to look for, if prop.loading is true then the [spinnerComponent]
     * will get rendered.
     * Defaults to 'data'.
     */
    prop?: string | Array<string>;
    /**
     * Timeout in milliseconds, the [spinnerComponent] wont get rendered
     * before the timeout.
     * Defaults to 100.
     */
    timeout?: number;
    /**
     * If the HOC should handle errors, if true the [errorComponent] will be rendered.
     * Defaults to true.
     */
    handleError?: boolean;
    /**
     * Component to be rendered if an error occurs.
     * Defaults to null.
     */
    errorComponent?: ReactType;
    /**
     * If the HOC should take partial data into account.
     * Defaults to false.
     */
    partial?: boolean;
    /**
     * Component that should be rendered while loading.
     * Defaults to a React Toolbox ProgressBar component.
     */
    spinnerComponent?: ReactType;
    /**
     * Extra props that should be passed to the [spinnerComponent].
     */
    spinnerProps?: Object;
    /**
     * Function that can be used to skip rendering the [errorComponent].
     * If it returns true the [errorComponent] will not get rendered.
     * This can for example be used to skip rendering the [errorComponent]
     * for validation errors.
     */
    skipErrors?: (data: any) => boolean;
    emptyComponent?: ReactType;
};
export declare const withSpinner: ({prop, timeout, handleError, partial, skipErrors, spinnerProps, errorComponent: ErrorComponent, spinnerComponent: Spinner, emptyComponent: EmptyComponent}?: Properties) => any;
