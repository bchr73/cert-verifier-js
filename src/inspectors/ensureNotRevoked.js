import VerifierError from '../models/verifierError';
import * as SUB_STEPS from '../constants/verificationSubSteps';
import domain from '../domain';
import { intersect } from '../helpers/array';

export default function ensureNotRevoked (revokedAddresses, keys) {
  if (!revokedAddresses || !keys) {
    // nothing to do
    return;
  }

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  keys = keys.filter(key => key != null);

  const matches = intersect(keys, revokedAddresses.map(assertion => assertion.id));

  if (matches.length > 0) {
    const indexOfMatch = revokedAddresses.findIndex(address => address.id === matches[0]);

    if (indexOfMatch > -1) {
      throw new VerifierError(
        SUB_STEPS.checkRevokedStatus,
        domain.certificates.generateRevocationReason(
          revokedAddresses[indexOfMatch].revocationReason
        )
      );
    }
  }
}
