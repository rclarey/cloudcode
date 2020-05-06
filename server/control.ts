/**
 * A generic operation interface to be used with the OT class.
 *
 * Specific implementations of `inclusionTransform` and `exclusionTransform` will likely
 * use more specific operation classes that implement this interface. See `src/charwise.ts`
 * for an example.
 */
export interface IOperation {
  /**
   * A stripped down version of the `OT.historyBuffer` that existed at the site where this
   * operation was created, when it was created.
   *
   * This array contains only the IDs of the operations in the original `OT.historyBuffer`.
   */
  historyBuffer: string[];
  /** A unique identifier for this operation */
  id: string;
}

/**
 * The class to be used as a singleton object to perform operational transform tasks at a
 * specific site.
 *
 * The class provides a high-level control algorithm for operational transform via its `goto`
 * method that is agnostic to the specific `inclusionTransform` and `exclusionTransform` used.
 *
 * Provided `inclusionTransform` and `exclusionTransform` functions should satisfy the TP1 and TP2
 * describe at https://en.wikipedia.org/wiki/Operational_transformation#Transformation_properties
 */
export class OT<T extends IOperation> {
  /**
   * Check if `op1` is dependent on or independent of `op2`.
   *
   * This is done by checking if `op1`'s definition context (`op1.historyBuffer`) contains `op2`;
   * if it does clearly `op1` is dependent on `op2`, otherwise `op1` is independent of `op2`
   *
   * @param {IOperation} op1 - the operation we are currently handling
   * @param {IOperation} op2 - the operation to compare `op1` to
   * @returns true if `op1` is independent of `op2`; false if `op1` is dependent on `op2`
   */
  public static operationsAreIndependent(
    op1: IOperation,
    op2: IOperation
  ): boolean {
    for (const id of op1.historyBuffer) {
      if (id === op2.id) {
        return false;
      }
    }

    return true;
  }

  public readonly historyBuffer: T[] = [];

  private idHistory: string[] = [];

  /**
   * @param {(op1: T, op2: T) => T} inclusionTransform
   *   - the inclusion transformation function to use
   * @param {(op1: T, op2: T) => T} exclusionTransform
   *   - the exclusion transformation function to use
   * @param {number} siteID - the id of the site at which this is being run. May be used
   *   for arbitration.
   */
  constructor(
    private inclusionTransform: (op1: T, op2: T) => T,
    private exclusionTransform: (op1: T, op2: T) => T,
    public siteID: number
  ) {}

  /**
   * Add an operation to the known history
   *
   * @param {op: T} - the operation to add
   */
  public addToHistory(op: T): void {
    this.historyBuffer.push(op);
    this.idHistory.push(op.id);
  }

  /**
   * Get an array of IDs for the operations known to this site.
   * This array can be used to set the `historyBuffer` field of newly created operations.
   *
   * @returns {string[]} the IDs of the operations known to this site
   */
  public history(): string[] {
    return this.idHistory;
  }

  /**
   * Swap two operations in an execution context
   *
   * @param {T} op1 - the operation that occurs earlier in the execution context
   * @param {T} op2 - the operation that occurs later in the execution context
   * @returns {[T, T]} the two input operations, swapped
   */
  public transpose(op1: T, op2: T): [T, T] {
    const op2Prime = this.exclusionTransform(op2, op1);
    const op1Prime = this.inclusionTransform(op1, op2Prime);
    return [op2Prime, op1Prime];
  }

  /**
   * Transpose the operation at `historyBuffer[end]` backwards so that it is at
   * `historyBuffer[start]`. This mutates `this.historyBuffer`.
   *
   * @param {number} start - the start of the range of transposition
   * @param {number} end - the end of the range of transposition
   */
  public listTranspose(start: number, end: number): void {
    const hb = this.historyBuffer;
    for (let i = end; i > start; i -= 1) {
      const result = this.transpose(hb[i - 1], hb[i]);
      [hb[i - 1], hb[i]] = result;
    }
  }

  /**
   * Perform inclusion transforms on `operation` against the operations from `start` to
   * the end of `historyBuffer`
   * @param {T} operation - the operation to transform
   * @param {number} start - index to start at
   * @returns {T} the result of `operation` transformed against `historyBuffer` from
   *   `start` to its end
   */
  public listInclusionTransform(operation: T, start: number): T {
    let transformed = operation;

    // transform operation from `start` to `end` in order
    for (let i = start; i < this.historyBuffer.length; i += 1) {
      const op2 = this.historyBuffer[i];
      transformed = this.inclusionTransform(transformed, op2);
    }

    return transformed;
  }

  /**
   * Transform an operation so that it "makes sense" in the given context.
   * More specifically, given `operation` and an execution context, `historyBuffer`,
   * generate the execution form of `operation`
   *
   * @param {T} operation - operation we want to execute
   * @returns {T} `operation` transformed so that it can be executed in `historyBuffer`
   */
  public goto(operation: T): T {
    // find the first operation that is independent with `operation`
    let k = -1;
    for (let i = 0; i < this.historyBuffer.length; i += 1) {
      if (OT.operationsAreIndependent(operation, this.historyBuffer[i])) {
        k = i;
        break;
      }
    }

    // if no operation in `historyBuffer` is independent with `operation` then the execution form
    // of `operation` is `operation`
    if (k === -1) {
      return operation;
    }

    // scan from k + 1 to the end of `historyBuffer` to find all operations causally
    // preceding `operation`
    const pre: number[] = [];
    for (let i = k + 1; i < this.historyBuffer.length; i += 1) {
      if (!OT.operationsAreIndependent(operation, this.historyBuffer[i])) {
        pre.push(i);
      }
    }

    // if no operation from k + 1 to the end of `historyBuffer` causally precedes `operation`, then
    // to get the execution form of `operation` simply perform an inclusion transform on `operation`
    // against every operation from k to the end of `historyBuffer` in order
    if (pre.length === 0) {
      return this.listInclusionTransform(operation, k);
    }

    // otherwise there IS one or more operations that causually precede `operation`, and
    // we must transpose those so that they are all contiguous and directly after the
    // first `k` operations that also causually precede `operation`
    const r = pre.length;
    for (let i = 0; i < r; i += 1) {
      this.listTranspose(k + i, pre[i]);
    }

    // simply perform an inclusion transform on `operation` against every operation from index
    // `k+r` to the end of `historyBuffer` in order
    return this.listInclusionTransform(operation, k + r);
  }
}
