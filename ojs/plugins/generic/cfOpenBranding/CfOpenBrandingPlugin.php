<?php

/**
 * @file plugins/generic/cfOpenBranding/CfOpenBrandingPlugin.php
 *
 * CF Open branding for the OJS editorial backend.
 */

namespace APP\plugins\generic\cfOpenBranding;

use APP\core\Application;
use APP\template\TemplateManager;
use PKP\plugins\GenericPlugin;
use PKP\plugins\Hook;

class CfOpenBrandingPlugin extends GenericPlugin
{
    private const ASSET_VERSION = '1.0.0';

    /**
     * These values mirror frontend/src/lib/journals.ts.
     *
     * The soft and border colors are intentionally pale derivatives used only
     * for backend surfaces and focus treatments. They are never used for text.
     */
    private const JOURNAL_PALETTES = [
        'jss' => [
            'primary' => '#102f4f',
            'secondary' => '#1f5f91',
            'accent' => '#8fc7f2',
            'soft' => '#edf5fb',
            'border' => '#b7cde0',
            'rgb' => '31, 95, 145',
        ],
        'jcf' => [
            'primary' => '#2f1d40',
            'secondary' => '#664483',
            'accent' => '#d0afea',
            'soft' => '#f6f1f9',
            'border' => '#d4c2df',
            'rgb' => '102, 68, 131',
        ],
        'jecf' => [
            'primary' => '#432600',
            'secondary' => '#8a5615',
            'accent' => '#f0b65f',
            'soft' => '#fbf6ed',
            'border' => '#dbc6a5',
            'rgb' => '138, 86, 21',
        ],
        'jcfo' => [
            'primary' => '#4c211b',
            'secondary' => '#954b40',
            'accent' => '#f2a191',
            'soft' => '#fbf1ef',
            'border' => '#dbbdb7',
            'rgb' => '149, 75, 64',
        ],
    ];

    /**
     * Site-level OJS pages use CF Open's navy identity.
     */
    private const DEFAULT_PALETTE = self::JOURNAL_PALETTES['jss'];

    /**
     * @copydoc Plugin::register()
     *
     * @param null|mixed $mainContextId
     */
    public function register($category, $path, $mainContextId = null)
    {
        if (!parent::register($category, $path, $mainContextId)) {
            return false;
        }

        if ($this->getEnabled($mainContextId)) {
            // This hook only runs for OJS backend layouts. It leaves every
            // frontend theme and journal stylesheet completely untouched.
            Hook::add('TemplateManager::setupBackendPage', $this->addBackendStyles(...));
        }

        return true;
    }

    /**
     * Enable once at site level and brand every journal context.
     */
    public function isSitePlugin(): bool
    {
        return true;
    }

    public function getDisplayName(): string
    {
        return __('plugins.generic.cfOpenBranding.name');
    }

    public function getDescription(): string
    {
        return __('plugins.generic.cfOpenBranding.description');
    }

    /**
     * Register the shared backend stylesheet and context-specific CSS tokens.
     *
     * @param string $hookName
     * @param array $args
     */
    public function addBackendStyles(string $hookName, array $args): bool
    {
        $request = Application::get()->getRequest();
        $templateManager = TemplateManager::getManager($request);
        $context = $request->getContext();
        $contextPath = $context ? strtolower((string) $context->getPath()) : '';
        $palette = self::JOURNAL_PALETTES[$contextPath] ?? self::DEFAULT_PALETTE;

        $templateManager->addStyleSheet(
            'cfOpenBackendBranding',
            rtrim($request->getBaseUrl(), '/') . '/' . $this->getPluginPath() . '/styles/backend.css?v=' . self::ASSET_VERSION,
            [
                'contexts' => ['backend'],
                'priority' => TemplateManager::STYLE_SEQUENCE_LAST,
            ]
        );

        $templateManager->addStyleSheet(
            'cfOpenBackendPalette',
            $this->getPaletteCss($palette),
            [
                'contexts' => ['backend'],
                'inline' => true,
                'priority' => TemplateManager::STYLE_SEQUENCE_LAST,
            ]
        );

        return Hook::CONTINUE;
    }

    /**
     * Build trusted inline CSS custom properties from the fixed palette map.
     *
     * @param array<string, string> $palette
     */
    private function getPaletteCss(array $palette): string
    {
        return sprintf(
            ':root {' .
            '--cf-brand-primary:%s;' .
            '--cf-brand-secondary:%s;' .
            '--cf-brand-accent:%s;' .
            '--cf-brand-soft:%s;' .
            '--cf-brand-border:%s;' .
            '--cf-brand-rgb:%s;' .
            '--color-primary:%s;' .
            '--color-hover:%s;' .
            '--background-color-selection-dark:%s;' .
            '--background-color-selection-light:%s;' .
            '--text-color-heading:%s;' .
            '}',
            $palette['primary'],
            $palette['secondary'],
            $palette['accent'],
            $palette['soft'],
            $palette['border'],
            $palette['rgb'],
            $palette['secondary'],
            $palette['primary'],
            $palette['primary'],
            $palette['soft'],
            $palette['primary']
        );
    }
}
