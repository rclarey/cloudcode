import { IOperation } from "./control.ts";

/** The type of an operation. Either insert or delete */
export enum OperationType {
  DELETE = "d",
  INSERT = "i"
}

/** A character-wise plaintext operation */
export class Operation implements IOperation {
  /** Auxillary position information to allow IT/ET to be reversible */
  public auxPos: number;
  /**
   * @param {OperationType} type - the type of operation; either insert or delete. This is needed
   *   for type information to be preserved when sending operations to and from a server
   * @param {number} position - the position of this operation as an offset from the beginning
   *   of the document
   * @param {string} id - a unique identifier for this operation
   * @param {number} siteID - the id of the site where this operation was generated
   * @param {string[]} historyBuffer - the context this operation was created in
   * @param {boolean} isNoop - whether this operation actually is a no-op
   */
  protected constructor(
    public type: OperationType,
    public position: number,
    public id: string,
    public siteID: number,
    public historyBuffer: string[],
    public isNoop: boolean
  ) {
    this.auxPos = position;
  }
}

/** An insert operation */
export class Insert extends Operation {
  /**
   * @param {string} char - the character this operation inserts
   * @param {number} position - where the operation starts in the document
   * @param {string} id - a unique identifier for this operation
   * @param {number} siteID - the id of the site where this operation was created
   * @param {string[]} histroyBuffer - the context this operation was created in
   */
  constructor(
    public char: string,
    position: number,
    id: string,
    siteID: number,
    historyBuffer: string[],
    isNoop: boolean = false
  ) {
    super(OperationType.INSERT, position, id, siteID, historyBuffer, isNoop);
  }
}

/** A delete TextOperation */
export class Delete extends Operation {
  /**
   * @param {number} position - where the operation starts in the document
   * @param {string} id - a unique identifier for this operation
   * @param {number} siteID - the id of the site where this operation was created
   * @param {string[]} histroyBuffer - the context this operation was created in
   */
  constructor(
    position: number,
    id: string,
    siteID: number,
    historyBuffer: string[],
    isNoop: boolean = false
  ) {
    super(OperationType.DELETE, position, id, siteID, historyBuffer, isNoop);
  }
}

/**
 * Transforms op1 against op2 such that the impact of op2
 * is effectively included in op1
 *
 * @param {Operation} op1 - the operation to transform
 * @param {Operation} op2 - the operation to transform op1 against
 * @returns {Operation} the result of op1 transformed against op2
 */
export function inclusionTransform(op1: Operation, op2: Operation): Operation {
  if (op1.isNoop) {
    if (
      op1 instanceof Delete &&
      op2 instanceof Insert &&
      op1.position === op2.position
    ) {
      return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer);
    }

    return op1;
  }

  if (op2.isNoop) {
    if (
      op1 instanceof Insert &&
      op2 instanceof Delete &&
      op1.position === op2.auxPos
    ) {
      return new Insert(
        op1.char,
        op1.position,
        op1.id,
        op1.siteID,
        op1.historyBuffer,
        true
      );
    }

    return op1;
  }

  if (op1 instanceof Insert && op2 instanceof Insert) {
    if (
      op1.position < op2.position ||
      (op1.position === op2.position && op1.siteID <= op2.siteID)
    ) {
      return new Insert(
        op1.char,
        op1.auxPos,
        op1.id,
        op1.siteID,
        op1.historyBuffer
      );
    }

    const pos = Math.min(op1.position, op1.auxPos) + 1;
    return new Insert(op1.char, pos, op1.id, op1.siteID, op1.historyBuffer);
  }

  if (op1 instanceof Insert && op2 instanceof Delete) {
    if (op1.position <= op2.position) {
      return op1;
    }

    const op3 = new Insert(
      op1.char,
      op1.position - 1,
      op1.id,
      op1.siteID,
      op1.historyBuffer
    );
    op3.auxPos = op1.position;
    return op3;
  }

  if (op1 instanceof Delete && op2 instanceof Insert) {
    if (op1.position < op2.position) {
      return op1;
    }

    return new Delete(op1.position + 1, op1.id, op1.siteID, op1.historyBuffer);
  }

  if (op1 instanceof Delete && op2 instanceof Delete) {
    if (op1.position === op2.position) {
      return new Delete(
        op1.position,
        op1.id,
        op1.siteID,
        op1.historyBuffer,
        true
      );
    }

    if (op1.position < op2.position) {
      return op1;
    }

    const op3 = new Delete(
      op1.position - 1,
      op1.id,
      op1.siteID,
      op1.historyBuffer
    );
    op3.auxPos = op1.position;
    return op3;
  }

  return op1;
}

/**
 * Transforms op1 against op2 such that the impact of op2
 * is effectively excluded from op1
 *
 * @param {Operation} op1 - the operation to transform
 * @param {Operation} op2 - the operation to transform op1 against
 * @returns {Operation} the result of op1 transformed against op2
 */
export function exclusionTransform(op1: Operation, op2: Operation): Operation {
  if (op1.isNoop) {
    if (
      op2.isNoop &&
      op1.position === op2.position &&
      op1 instanceof Insert &&
      op2 instanceof Delete
    ) {
      return new Insert(
        op1.char,
        op1.position,
        op1.id,
        op1.siteID,
        op1.historyBuffer
      );
    }

    if (
      op1.position === op2.position &&
      op1 instanceof Delete &&
      op2 instanceof Delete
    ) {
      return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer);
    }

    if (op1 instanceof Delete && op2 instanceof Insert) {
      const op = new Delete(
        op1.position,
        op1.id,
        op1.siteID,
        op1.historyBuffer,
        true
      );
      op.auxPos = -1;
      return op;
    }

    return op1;
  }

  if (op2.isNoop) {
    return op1;
  }

  if (op1 instanceof Insert && op2 instanceof Insert) {
    if (op1.position === op2.position && op1.siteID > op2.siteID) {
      const op3 = new Insert(
        op1.char,
        op1.position,
        op1.id,
        op1.siteID,
        op1.historyBuffer
      );
      op3.auxPos = op1.position - 1;
      return op3;
    }

    if (op1.position <= op2.position) {
      op2.auxPos = op2.position + 1;
      return op1;
    }

    const op4 = new Insert(
      op1.char,
      op1.position - 1,
      op1.id,
      op1.siteID,
      op1.historyBuffer
    );
    if (op1.siteID < op2.siteID) {
      op4.auxPos = op1.position;
    }

    return op4;
  }

  if (op1 instanceof Insert && op2 instanceof Delete) {
    if (op1.position === op2.position) {
      return new Insert(
        op1.char,
        op1.auxPos,
        op1.id,
        op1.siteID,
        op1.historyBuffer
      );
    }

    if (op1.position < op2.position) {
      return op1;
    }

    return new Insert(
      op1.char,
      op1.position + 1,
      op1.id,
      op1.siteID,
      op1.historyBuffer
    );
  }

  if (op1 instanceof Delete && op2 instanceof Insert) {
    if (op1.position === op2.position) {
      return new Delete(
        op1.position,
        op1.id,
        op1.siteID,
        op1.historyBuffer,
        true
      );
    }

    if (op1.position < op2.position) {
      return op1;
    }

    return new Delete(op1.position - 1, op1.id, op1.siteID, op1.historyBuffer);
  }

  if (op1 instanceof Delete && op2 instanceof Delete) {
    if (op1.position >= op2.position) {
      return new Delete(
        op1.position + 1,
        op1.id,
        op1.siteID,
        op1.historyBuffer
      );
    }

    return new Delete(op1.position, op1.id, op1.siteID, op1.historyBuffer);
  }

  return op1;
}

/**
 * A stripped down version of the `Operation` class without fields needed only for
 * internal computations
 */
export interface ISerializedOperation extends IOperation {
  char?: string;
  position: number;
  siteID: number;
  type: OperationType;
}

/**
 * Strip fields that are used internally for transforms
 *
 * @param {Operation} operation - the operation to serialize
 * @returns {ISerializedOperation} `operation` serialized
 */
export function serialize(operation: Operation): ISerializedOperation {
  const { historyBuffer, id, type, position, siteID } = operation;
  const serialized: ISerializedOperation = {
    historyBuffer,
    id,
    type,
    position,
    siteID
  };
  if (operation instanceof Insert) {
    serialized.char = operation.char;
  }

  return serialized;
}

/**
 * Give an operation received as JSON over a network correct type information
 *
 * @param {ISerializedOperation} serialized - the operation to deserialize
 * @returns {Operation} `serialized` recreated as an instance of either `Insert`
 *   or `Delete` as appropriate
 */
export function deserialize(op: ISerializedOperation): Operation {
  if (op.type === OperationType.INSERT) {
    return new Insert(
      op.char!,
      op.position,
      op.id,
      op.siteID,
      op.historyBuffer
    );
  }

  return new Delete(op.position, op.id, op.siteID, op.historyBuffer);
}
