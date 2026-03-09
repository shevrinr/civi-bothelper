<?php



/**
 * @file
 * Contains bothelper.php.
 */

require_once 'BOThelper.civix.php';
require_once 'inc/BOThelper.inc';

/**
 * Implements hook_civicrm_config().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_config/
 */
function BOThelper_civicrm_config(&$config): void {
  _BOThelper_civix_civicrm_config($config);
}

/**
 * Implements hook_civicrm_install().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_install
 */
function BOThelper_civicrm_install(): void {
  _BOThelper_civix_civicrm_install();
}

/**
 * Implements hook_civicrm_enable().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_enable
 */
function BOThelper_civicrm_enable(): void {
  _BOThelper_civix_civicrm_enable();
}

/**
 * Implement hook_civicrm_merge().
 *
 * To add civicrm relationship fields in merge options.
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_merge
 */


/**
 * Implements hook_civicrm_buildForm().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_buildForm
 */
function BOThelper_civicrm_buildForm($formName, &$form) {
  // Contribution "Donate" page: civicrm/contribute/transact?id=#
  if ($formName === 'CRM_Contribute_Form_Contribution_Main') {
    // Contribution Page ID (from ?id=1)
    $pageId = $form->_id ?? $form->_contributionPageID ?? NULL;

    if ((int) $pageId === 1) {
      \Civi::resources()->addScriptFile('BOThelper', 'js/custom.js');
      // ^ no leading slash is the usual pattern for extensions
    }
  }
  if ($formName === 'CRM_Contribute_Form_Contribution_Main') {
    // Contribution Page ID (from ?id=1)
    $pageId = $form->_id ?? $form->_contributionPageID ?? NULL;

    if ((int) $pageId === 1) {
      \Civi::resources()->addScriptFile('BOThelper', 'css/custom.css');
    }
  }
  if ($formName === 'CRM_Contact_Form_Search_Advanced') {
    \Civi::resources()->addScriptFile('BOThelper', 'js/radio_button.js');
  }
  if ($formName === 'CRM_Activity_Form_Search') {
    \Civi::resources()->addScriptFile('BOThelper', 'js/radio_button.js');
  }
}

function BOThelper_civicrm_pageRun(&$page) {

  Civi::resources()->addScriptFile(
    'BOThelper',
    'js/remove-bootstrap-theme.js',
    200
  );

}