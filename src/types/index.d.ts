// Default Context

type DispatchFunction = (payload?: any) => void;

type ActionComposer = (dispatch: Function, type: string) => DispatchFunction;

interface ActionType {
  type: string;
  payload: any;
}
