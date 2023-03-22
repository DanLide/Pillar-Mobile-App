import { TaskExecutor, Task } from "../taskExecutor";

const createTask = (
  successMock: () => void,
  cancelMock: () => void,
  isFailed = false
) => {
  class BaseTask extends Task {
    constructor() {
      super();
    }

    async run() {
      await new Promise<void>((resolve) => {
        if (isFailed) {
          throw "error";
        } else {
          successMock();
          resolve();
        }
      });
    }

    cancel(): void {
      cancelMock();
    }
  }

  return new BaseTask();
};

describe("taskExecutor", () => {
  const mockFirstTaskExecuted = jest.fn();
  const mockSecondTaskExecuted = jest.fn();
  const mockThirdTaskExecuted = jest.fn();

  const mockFirstCancelTaskExecuted = jest.fn();
  const mockSecondCancelTaskExecuted = jest.fn();
  const mockThirdCancelTaskExecuted = jest.fn();

  const mockCleanupFunction = jest.fn();

  const mockSuccessFirstTask = createTask(
    mockFirstTaskExecuted,
    mockFirstCancelTaskExecuted
  );
  const mockSuccessSecondTask = createTask(
    mockSecondTaskExecuted,
    mockSecondCancelTaskExecuted
  );
  const mockFailedTask = createTask(
    mockThirdTaskExecuted,
    mockThirdCancelTaskExecuted,
    true
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should run success tasks and return true", async () => {
    // execute method should NOT crash
    await new TaskExecutor(
      [mockSuccessFirstTask, mockSuccessSecondTask],
      mockCleanupFunction
    )
      .execute()
      .catch((error) => expect(error).toBe(undefined));

    // should NOT call cleanup function
    expect(mockFirstCancelTaskExecuted).not.toBeCalled();
    expect(mockSecondCancelTaskExecuted).not.toBeCalled();
    expect(mockCleanupFunction).not.toBeCalled();
  });

  it("should NOT run tasks after failed and cancel next tasks", async () => {
    // should crash
    await new TaskExecutor(
      [mockSuccessFirstTask, mockFailedTask, mockSuccessSecondTask],
      mockCleanupFunction
    )
      .execute()
      .catch((error) => expect(error).not.toBe(undefined));

    expect(mockFirstTaskExecuted).toBeCalled();
    expect(mockThirdTaskExecuted).not.toBeCalled();
    expect(mockSecondTaskExecuted).not.toBeCalled();

    expect(mockFirstCancelTaskExecuted).toBeCalled();
    expect(mockSecondCancelTaskExecuted).toBeCalled();
    expect(mockThirdCancelTaskExecuted).toBeCalled();
    expect(mockCleanupFunction).toBeCalled();
  });
});
