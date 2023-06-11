type CurrentAction =
  | {
      type: 'click';
      id: string;
    }
  | {
      type: 'move';
      id: string;
    };
